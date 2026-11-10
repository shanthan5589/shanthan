import katex from "katex";

function MathBlock({ expression }: { expression: string }) {
  return (
    <div
      className="math-block"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(expression, {
          displayMode: true,
          throwOnError: false,
        }),
      }}
    />
  );
}

function InlineMath({ expression }: { expression: string }) {
  return (
    <span
      className="math-inline"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(expression, {
          displayMode: false,
          throwOnError: false,
        }),
      }}
    />
  );
}

export const backpropagationPart1 = (
  <>
    <p>
      Backpropagation is easiest to understand in the smallest possible neural network. In this
      first part, we use logistic regression — a single neuron — to derive how gradients flow from
      the loss back to the weights and bias. Once this foundation is clear, the same chain-rule
      pattern can be extended to deeper neural networks.
    </p>

    <h2>What is Logistic Regression?</h2>

    <p>
      Logistic regression is the simplest neural network possible — a single neuron. It takes an
      input, computes a weighted sum, passes it through a sigmoid activation, and outputs a
      probability between 0 and 1.
    </p>

    <p>
      It answers one question: <strong>given this input, what is the probability it belongs to class 1?</strong>
    </p>

    <h2>Architecture</h2>

    <p>Sigmoid and binary cross entropy loss are choosen for this explanation, but the same principles of backpropagation apply to any activation function and loss function.</p>

    <MathBlock
      expression={String.raw`\text{X (features)} \longrightarrow Z = W^T X + b \longrightarrow A = \text{sigmoid}(Z) \longrightarrow \text{Loss}`}
    />


    <ul>
      <li><strong>X</strong> — input features, shape <code>(n_features, m)</code> where m = number of training examples</li>
      <li><strong>W</strong> — weights, shape <code>(n_features, 1)</code></li>
      <li><strong>b</strong> — bias, scalar</li>
      <li><strong>A</strong> — predicted probability, shape <code>(1, m)</code></li>
      <li><strong>Y</strong> — true labels, shape <code>(1, m)</code></li>
    </ul>

    <h2>Forward Propagation</h2>

    <p><strong>Step 1 — Linear combination:</strong></p>

    <MathBlock expression={String.raw`Z = W^T X + b`} />

    <p>Each feature is multiplied by its weight, summed up, and a bias is added. This gives a raw score.</p>

    <p><strong>Step 2 — Sigmoid activation:</strong></p>

    <MathBlock expression={String.raw`A = \sigma(Z) = \frac{1}{1 + e^{-Z}}`} />

    <p>Sigmoid squashes the raw score into a probability between 0 and 1.</p>

    <ul>
      <li>If Z is very large → A ≈ 1 (confident it&apos;s class 1)</li>
      <li>If Z is very small → A ≈ 0 (confident it&apos;s class 0)</li>
      <li>If Z = 0 → A = 0.5 (completely uncertain)</li>
    </ul>

    <h2>Loss Function</h2>

    <p>For one training example, the <strong>binary cross-entropy loss</strong> is:</p>

    <MathBlock expression={String.raw`\ell(a,y) = -\left[y\log(a) + (1-y)\log(1-a)\right]`} />

    <p>For a batch of <InlineMath expression={String.raw`m`} /> examples, the cost is the average of the individual losses:</p>

    <MathBlock expression={String.raw`J(W,b) = \frac{1}{m}\sum_{i=1}^{m}\ell\left(a^{(i)},y^{(i)}\right)`} />

    {/* <p><strong>Why not mean squared error?</strong></p>

    <p>
      MSE with sigmoid creates a non-convex loss surface with many local minima — gradient descent
      gets stuck. Cross-entropy with sigmoid creates a convex surface — gradient descent always
      finds the global minimum.
    </p> */}

    <p><strong>Intuition behind the formula:</strong></p>

    <p>For a single training example, binary cross-entropy reduces to two cases:</p>

    <MathBlock expression={String.raw`\ell(a,y) = \begin{cases} -\log(a), & y = 1, \\ -\log(1-a), & y = 0. \end{cases}`} />

    <p>The limiting behavior of these two cases is:</p>

    <MathBlock expression={String.raw`\begin{aligned} y=1: &\quad a \to 1 \Rightarrow \ell \to 0, && a \to 0 \Rightarrow \ell \to \infty, \\ y=0: &\quad a \to 0 \Rightarrow \ell \to 0, && a \to 1 \Rightarrow \ell \to \infty. \end{aligned}`} />

    <p>The network is heavily penalized for confident wrong predictions.</p>

    <h2>Backpropagation</h2>

    <p>Backpropagation might feel intimidating at first, so here is a simple example to make it more intuitive.</p>
    <p>
      Let&apos;s say there are three quantities: A, B, and C. We want to know how much C changes when
      A changes by a small amount. In calculus, the chain rule tells us that the rate at which C
      changes with respect to A is equal to the rate at which C changes with respect to B
      multiplied by the rate at which B changes with respect to A.
    </p>

    <MathBlock expression={String.raw`A \longrightarrow B \longrightarrow C`} />

    <p>This can be represented mathematically as:</p>

    <MathBlock expression={String.raw`\frac{\partial C}{\partial A} = \frac{\partial C}{\partial B} \cdot \frac{\partial B}{\partial A}`} />

    <p>Lets assume that:</p>

    <ul>
      <li>A is the Indian Rupee</li>
      <li>B is the US Dollar</li>
      <li>C is the Pound Sterling.</li>
    </ul>

    <p>The rates of change are as follows:</p>

    <ul>
      <li>1 INR = 0.011 USD (for every increase of 1 INR, US Dollar increases by 0.011)</li>
      <li>1 USD = 0.75 Pound sterling (for every increase of 1 USD, Pound Sterling increases by 0.75)</li>
    </ul>

    <p>So now the question is how much does Pound Sterling change when Indian Rupee changes by 1?</p>

    <p>We use the chaing rule:</p>

    <MathBlock expression={String.raw`\frac{\partial C}{\partial B} = 0.75`} /> <MathBlock expression={String.raw`\frac{\partial B}{\partial A} = 0.011`} />

    <p>Multiplying the two derivatives gives:</p>

    <MathBlock expression={String.raw`\frac{\partial C}{\partial A} = 0.75 \cdot 0.011 = 0.00825`} />

    <p>So for every increase of 1 INR, Pound Sterling increases by 0.00825.</p>
    
    <h2>Backpropagation in Logistic Regression</h2>

    <p>We need to find out how sensitive is the output to changes in the weights and biases.
       We use the <strong>chain rule</strong> to compute how the loss changes with respect to each parameter. </p>

    <p><strong>dz — change in loss with respect to change in z:</strong></p>

    <p><strong>z</strong> affects <strong>a</strong>, and <strong>a</strong> affects the <strong>loss</strong>.</p>

    <MathBlock expression={String.raw`z \longrightarrow a \longrightarrow \ell`} />

    <p>If we want to know how much the <strong>loss</strong> changes with respect to <strong>z</strong>, then we need to find how much the <strong>loss</strong> changes with respect to <strong>a</strong> and how much <strong>a</strong> changes with respect to <strong>z</strong>. We multiply these derivatives together.</p>

    <MathBlock expression={String.raw`\frac{\partial \ell}{\partial z} = \frac{\partial \ell}{\partial a} \cdot \frac{\partial a}{\partial z}`} />

    <p>Breaking it down:</p>

    <MathBlock expression={String.raw`\frac{\partial \ell}{\partial a} = -\frac{y}{a} + \frac{1-y}{1-a}`} />

    <MathBlock expression={String.raw`\frac{\partial a}{\partial z} = a(1-a) \quad \text{(sigmoid derivative)}`} />

    <p>Multiplying the two derivatives gives:</p>

    <MathBlock expression={String.raw`\frac{\partial \ell}{\partial a} \cdot \frac{\partial a}{\partial z} = \left(-\frac{y}{a} + \frac{1-y}{1-a}\right) a(1-a)`} />

    <p>After simplifying, we get:</p>
    <MathBlock expression={String.raw`\frac{\partial \ell}{\partial z} = a-y`} />

    <p>For the <InlineMath expression={String.raw`i`} />-th training example, we write this as:</p>

    <MathBlock expression={String.raw`dz^{(i)} = a^{(i)}-y^{(i)}`} />

    <p>This is the key shortcut for a sigmoid output with binary cross-entropy.</p>

    <p><strong>dW — change in loss with respect to change in W:</strong></p>

    <p><strong>W</strong> affects <strong>z</strong>, and <strong>z</strong> affects the <strong>loss</strong>.</p>

    <MathBlock expression={String.raw`W \longrightarrow z \longrightarrow \ell`} />

    <p>If we want to know how much the <strong>loss</strong> changes with respect to <strong>W</strong>, then we need to find how much the <strong>loss</strong> changes with respect to <strong>z</strong> and how much <strong>z</strong> changes with respect to <strong>W</strong>. We multiply these derivatives together.</p>

    <MathBlock expression={String.raw`\frac{\partial \ell}{\partial w} = \frac{\partial \ell}{\partial z} \cdot \frac{\partial z}{\partial w}`} />

    <p>Breaking it down:</p>

    <MathBlock expression={String.raw`\frac{\partial \ell}{\partial z} = a-y`} />

    <MathBlock expression={String.raw`\frac{\partial z}{\partial w} = x`} />
    
    <p>Multiplying the two derivatives gives:</p>

    <MathBlock expression={String.raw`\frac{\partial \ell}{\partial w} = (a-y)x`} />

    <p>Averaging the contributions from all <InlineMath expression={String.raw`m`} /> examples gives:</p>

    <MathBlock expression={String.raw`dW = \frac{1}{m}\sum_{i=1}^{m}x^{(i)}dz^{(i)}`} />

    <p><strong>db — change in loss with respect to change in b:</strong></p>

    <p><strong>b</strong> affects <strong>z</strong>, and <strong>z</strong> affects the <strong>loss</strong>.</p>

    <MathBlock expression={String.raw`b \longrightarrow z \longrightarrow \ell`} />

    <p>If we want to know how much the <strong>loss</strong> changes with respect to <strong>b</strong>, then we need to find how much the <strong>loss</strong> changes with respect to <strong>z</strong> and how much <strong>z</strong> changes with respect to <strong>b</strong>. We multiply these derivatives together.</p>

    <MathBlock expression={String.raw`\frac{\partial \ell}{\partial b} = \frac{\partial \ell}{\partial z} \cdot \frac{\partial z}{\partial b}`} />
    
    <p>Because <InlineMath expression={String.raw`\frac{\partial z}{\partial b}=1`} />, the gradient contributed by one example is:</p>

    <MathBlock expression={String.raw`\frac{\partial \ell}{\partial b} = a-y`} />

    <p>Averaging the contributions from all <InlineMath expression={String.raw`m`} /> examples gives:</p>

    <MathBlock expression={String.raw`db = \frac{1}{m}\sum_{i=1}^{m}dz^{(i)}`} />

    <p>
      We divide by m to average the gradient across all training examples — without this, the
      gradient magnitude would scale with dataset size.
    </p>

    <h2>Gradient Descent</h2>

    <p>Once we have the gradients, we update the weights:</p>

    <MathBlock expression={String.raw`W \leftarrow W - \alpha \cdot dW`} />
    <MathBlock expression={String.raw`b \leftarrow b - \alpha \cdot db`} />

    <p>Where <strong>α</strong> (alpha) is the learning rate — how big a step we take toward the minimum.</p>

    <ul>
      <li>Too large → overshoots the minimum, loss diverges</li>
      <li>Too small → takes forever to converge</li>
      <li>Just right → loss decreases smoothly to minimum</li>
    </ul>

    <p>In the above explaination, we have used logistic regression with a sigmoid activation function with binary cross 
      entropy loss, but in practice you can use any activation function and any loss function, and the same principles of backpropagation apply. 

      So before we move to the next part, we will try to generalize the backpropagation algorithm for any activation function and any 
      loss function.
    </p>

    Let the activation function be <InlineMath expression={String.raw`\sigma`} /> and the loss function be <InlineMath expression={String.raw`L`} />. Then the backpropagation algorithm can be summarized as follows:

    <MathBlock expression={String.raw`
dz = \frac{\partial L}{\partial z} = \frac{\partial L}{\partial a} \cdot \frac{\partial a}{\partial z} = \frac{\partial L}{\partial a} \cdot \sigma'(z)
`} />

    <MathBlock expression={String.raw`
dW = \frac{1}{m}\sum_{i=1}^{m}x^{(i)}dz^{(i)}
`} />

    <MathBlock expression={String.raw`
db = \frac{1}{m}\sum_{i=1}^{m}dz^{(i)}
`} />

    <p>Where <InlineMath expression={String.raw`\sigma'`} /> is the derivative of the activation function with respect to its input.</p>

    <p>You can check the code implementation for this part of the series <a href="https://github.com/shanthan5589/neural-networks-from-scratch/blob/main/01_logistic_regression/logistic_regression.ipynb">here</a>.</p>

  </>
);
