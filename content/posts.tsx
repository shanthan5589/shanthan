import type { ReactNode } from "react";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: ReactNode;
}

// Add your posts here. Dates use the YYYY-MM-DD format.


export const blogPosts: BlogPost[] = [
  {
    slug: "mesogpt",
    title: "mesoGPT",
    description: "Building and training large language models from scratch.",
    date: "2026-09-21",
    content: (
      <>
        <p>
          I built mesoGPT to learn how the main parts of language-model training work together
          and along the way, I worked with tokenizers, data pipelines, model architectures,
          compute planning, cost estimations, and efficiency.
        </p>
        <img
          src="https://miro.medium.com/v2/resize:fit:875/1*RxpgNdMbcL8PBrcnEh9cqQ.jpeg"
          alt="Spiral Galaxy illustration"
          className="w-full rounded-lg"
        />
        <p>
          The current model is a 97.7M-parameter decoder-only Transformer trained on a single
          NVIDIA L40S. It is not intended to compete with production language models, and it does
          not introduce a new architecture. The purpose is to build a system large enough for
          training and systems problems to appear, while remaining small enough to inspect,
          measure, and run without a distributed cluster.
        </p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">What “from scratch” means here</h2>
        <p>
          “Training a language model from scratch” can mean several different things, so it is
          useful to be precise.
        </p>
        <p>
          For this project, it means that the tokenizer was trained separately, the model began
          training from randomly initialized weights, and the Transformer architecture, data
          pipeline, training loop, evaluation, checkpointing, and experiment tracking were
          assembled in PyTorch.
        </p>
        <p>
          It does not mean that every underlying operation was implemented from first principles.
          mesoGPT relies on PyTorch, CUDA, rustbpe, tiktoken, PyArrow, and an existing text
          dataset. I did not write custom CUDA kernels or implement Flash Attention itself.
        </p>
        <p>
          That distinction matters. The goal was to understand how the pieces of language-model
          training fit together, not to reproduce every layer of the software stack.
        </p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">The complete pipeline</h2>
        <p>The project follows a relatively conventional pretraining pipeline:</p>
        <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-neutral-300">
          {`ClimbMix Parquet shards
        ↓
Byte-level BPE tokenizer
        ↓
Streaming token dataloader
        ↓
Decoder-only Transformer
        ↓
Pretraining and validation
        ↓
Checkpoint and metadata
        ↓
Autoregressive text generation`}
        </pre>
        <p>
          None of these stages is especially mysterious in isolation. The difficulty comes from
          making them work together.
        </p>
        <p>
          The tokenizer’s vocabulary size determines the model’s embedding and output dimensions.
          Choosing the right vocabulary size is crucial for balancing model capacity and training
          efficiency. The dataloader must produce correctly shifted input and target sequences.
          The training loop must handle gradient accumulation, mixed precision, and evaluation
          without introducing instability. Checkpointing must capture the model state, optimizer
          state, and training metadata. Finally, the generation interface must correctly use the
          trained model to produce coherent text.
        </p>
        <p>
          So we have to make sure all components work together without introducing bugs or
          numerical instability. That is the essence of training a language model from scratch.
        </p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">Starting with the tokenizer</h2>
        <p>Before training the language model, I had to train a tokenizer.</p>
        <p>
          The tokenizer is a byte-level BPE tokenizer with a fixed vocabulary of 16,384 tokens.
          rustbpe is used to learn the vocabulary, while tiktoken provides fast encoding and
          decoding. Nine special tokens are reserved for possible later use.
        </p>
        <p>
          The experiment trained eleven tokenizers using corpus sizes ranging from 25 million to
          500 million characters. Each tokenizer was evaluated on the same held-out shard using:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Characters per token</li>
          <li>UTF-8 bytes per token</li>
          <li>Tokens per word</li>
          <li>Total validation tokens produced</li>
        </ul>
        <p>
          The expectation was straightforward: more tokenizer-training text should improve
          held-out compression, but the improvement should eventually flatten.
        </p>
        <p>That is roughly what happened.</p>
        <p>
          The tokenizer trained on 450M characters produced the best measured result, reducing the
          held-out corpus to 57,613,409 tokens. However, most of the gain had already appeared much
          earlier. The 250M-character tokenizer captured approximately 97.2% of the total token
          reduction observed between the 25M and 450M conditions.
        </p>
        <p>
          Training on 250M characters took 19.05 seconds. Training on 450M took 32.75 seconds,
          while reducing the validation output by only another 6,246 tokens.
        </p>
        <p>
          The results were also not perfectly monotonic. The 400M and 500M conditions were
          slightly worse than nearby smaller conditions.
        </p>
        <p>
          The useful result was not that 450M was a universally correct training size. It was that
          tokenizer compression showed clear diminishing returns under this particular vocabulary,
          dataset, and evaluation setup.
        </p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">The model</h2>
        <p>The baseline model is a decoder-only Transformer with the following configuration:</p>
        <img
          src="https://miro.medium.com/v2/resize:fit:875/1*g-i_Si2ZmzxKQe5zD8CrRg.png"
          alt="mesoGPT model configuration"
          className="w-full rounded-lg"
        />
        <p>
          The implementation uses Pre-LayerNorm blocks, a fused QKV projection, rotary positional
          embeddings, and tied token-embedding and language-model-head weights.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-neutral-300">
          {`QKᵀ → scaling → causal mask → softmax → dropout → multiply by V`}
        </pre>
        <p>
          This makes the operation easy to inspect. However, as the later performance experiment
          showed that it is not an efficient way to execute attention in this manner.
        </p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">Planning the training run</h2>
        <p>
          I used a tokens/parameter ratio of approximately 20, inspired by the Chinchilla scaling
          laws
        </p>
        <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-neutral-300">
          {`97,655,296 parameters × 20 ≈ 1.953 billion tokens`}
        </pre>
        <p>
          With a global batch of 512 sequences and a context length of 1,024, each optimizer update
          processes:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-neutral-300">
          {`512 × 1,024 = 524,288 tokens`}
        </pre>
        <p>Reaching the planned budget therefore required 3,726 optimizer updates.</p>
        <p>
          The micro-batch contained 16 sequences. 32 gradient-accumulation steps were used to
          reach the global batch size of 512 without requiring the entire batch to fit in GPU
          memory at once.
        </p>
        <p>
          Training used AdamW, BF16 mixed precision, 40 warmup steps, and a cosine learning-rate
          schedule from a peak 3e-4 to 3e-5.
        </p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">The baseline run</h2>
        <p>
          The full baseline run completed on one NVIDIA L40S in 20 hours, 47 minutes, and 48
          seconds. The measured rental cost was $38.70.
        </p>
        <p>The best checkpoint appeared at optimizer step 3,720:</p>
        <img
          src="https://miro.medium.com/v2/resize:fit:875/1*kqMgEhy13kJ5U7tDgRjNtQ.png"
          alt="mesoGPT baseline training results"
          className="w-full rounded-lg"
        />
        <p>
          The final step was slightly worse, so the checkpointing code correctly retained the
          step-3,720 model.
        </p>
        <p>
          Bits per byte, or BPB, is useful when evaluating models with a custom tokenizer. Cross
          entropy loss depends on number of tokens generated, and number of tokens generated for a
          fixed text depends on the compression of a tokenizer. So BPB was used as a metric, making
          the result independent of one tokenizer’s compression.
        </p>
        <p>
          Training and validation loss remained very close throughout the run. The validation
          shard came from the same source distribution as the training shards, so similar curves
          are reasonable. They were calculated from different data, but their closeness should not
          be interpreted as evidence of broad generalization.
        </p>
        <p>The run established that the implementation could train a roughly 100M-parameter model stably.</p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">GPU utilization was not the same as efficiency</h2>
        <p>
          The baseline reported an average GPU utilization of 96.4%, with the GPU near 100% active
          utilization for much of the run. At first glance, that sounds efficient.
        </p>
        <p>However, the estimated end-to-end model FLOP utilization was only 4.22%.</p>
        <p>
          These measurements are not contradictory. GPU utilization usually indicates whether the
          device is busy. It does not indicate how close the arithmetic workload is to the GPU’s
          theoretical capacity. A GPU can remain busy while spending substantial time on moving
          intermediate tensors, launching kernels and handling other overhead.
        </p>
        <p>
          The explicit attention implementation was a likely source of the problem. With a context
          length of 1,024, it constructs the full attention-score tensor, applies a causal mask,
          runs softmax, and stores intermediate results needed for backpropagation. That is
          readable, but expensive in both memory traffic and storage.
        </p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">Testing PyTorch’s optimized attention path</h2>
        <p>
          The next experiment replaced the explicit attention sequence with PyTorch’s
          <code>scaled_dot_product_attention</code> API:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-neutral-300">
          {`torch.nn.functional.scaled_dot_product_attention(
    q, k, v, dropout_p=..., is_causal=True,
)`}
        </pre>
        <p>
          The experiment logs indicated that PyTorch selected its built-in Flash Attention backend
          for the tested configuration.
        </p>
        <p>
          To be clear, I did not implement Flash Attention. I changed the model to use PyTorch’s
          SDPA.
        </p>
        <p>
          This was a performance benchmark, not another complete pretraining run. The architecture,
          parameter count, global batch, context length, and precision remained unchanged.
          Micro-batch sizes of 16, 32, and 64 were tested over short runs.
        </p>
        <p>
          For an apples-to-apples comparison, the reported throughput and MFU excluded evaluation
          and used optimizer-update time only:
        </p>
        <img
          src="https://miro.medium.com/v2/resize:fit:1250/1*LbTDEuga1__cTpECIz7RpA.png"
          alt="Optimized attention benchmark results"
          className="w-full rounded-lg"
        />
        <p>The best configuration was still the smallest tested micro-batch size: 16 sequences.</p>
        <p>
          Relative to the explicit implementation, it delivered approximately 4.09 times the
          throughput. Increasing the micro-batch beyond 16 made both MFU and throughput worse in
          this setup.
        </p>
        <p>
          That result is a useful reminder that using larger micro-batch sizes does not automatically
          improve hardware efficiency. Large micro-batch sizes increase memory traffic and
          automatically reduce MFU and throughput.
        </p>
        <p>
          The 4.94% baseline MFU in this table differs from the earlier 4.22% figure because the
          two numbers answer different questions. The former measures training-only optimizer
          update time for the benchmark comparison. The latter uses the wall-clock duration of the
          complete baseline run, including evaluation and other overhead. Keeping those definitions
          separate helps us to make a fair comparison.
        </p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">What I learned</h2>
        <p>The project reinforced several lessons.</p>
        <p>
          First, tokenizer design is part of model design. Vocabulary size determines how much text
          fits into a fixed number of tokens and how much compute is required to process a corpus.
          It should not be treated as an unrelated preprocessing detail.
        </p>
        <p>
          Second, end-to-end accounting matters. Parameter count alone does not determine the cost
          of a run. Evaluation frequency, checkpointing, and data loading all affect runtime.
        </p>
        <p>
          Third, high device utilization is not proof of high model throughput. GPU telemetry and
          MFU describe different aspects of the system, and both are needed to understand
          performance.
        </p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">What the project does not establish</h2>
        <p>There are some limitations to keep in view.</p>
        <p>
          The model has not been instruction-tuned or aligned, and it should not be presented as a
          chat model. Its validation loss demonstrates that next-token pretraining worked, but it
          does not establish factual reliability, reasoning ability, or usefulness in deployment.
        </p>
        <p>
          The project also uses existing frameworks, libraries, and data. Its contribution is the
          implementation and study of a complete training pipeline at a practical scale, not a new
          optimizer, dataset, attention algorithm, or model architecture.
        </p>

        <h2 className="pt-4 text-base font-semibold text-neutral-200">Closing thoughts</h2>
        <p>mesoGPT did not produce a frontier model, and that was never its purpose.</p>
        <p>
          What it produced was a concrete understanding of how a language model moves from raw
          text to a trained checkpoint: how a tokenizer changes the compute budget, how GPU
          utilization can be misleading, and how a single implementation choice in attention can
          change MFU and throughput by several times.
        </p>
        <p>
          For me, that is the value of building at this scale. The model is large enough that the
          engineering is real, but small enough that the entire system can still be understood.
        </p>
        <p>
          If you have any questions, I recommend using{" "}
          <a
            href="https://deepwiki.com/shanthan5589/mesoGPT"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            DeepWiki
          </a>{" "}
          to get answers in a structured and organized manner.
        </p>
        <p>
          The code, experiment reports, configurations, logs, and checkpoints are available in the{" "}
          <a
            href="https://github.com/shanthan5589/mesoGPT"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            mesoGPT repository.
          </a>
          .
        </p>
      </>
    ),
  },
];
