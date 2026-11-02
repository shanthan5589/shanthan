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

export const backpropagationPart2 = (
  <>
    <p>
      In Part 1, we used logistic regression to understand how the chain rule works to calculate the gradients
      of all the learnable parameters in a single neuron. The same principle applies to a network with multiple layers.
    </p>

    <p>
      In this part, we add a hidden layer. This introduces the central idea behind backpropagation
      in deep neural networks: each layer receives a gradient from the layer after it and output
      of a layer becomes the input to the next layer. The chain rule is applied repeatedly, moving backward through the network.
    </p>

    <p>
      The network will use a ReLU activation in the hidden layer, a sigmoid activation in the
      output layer, and binary cross-entropy loss to measure the prediction error.
    </p>

    <h2>The Architecture</h2>

    <p>Consider a network with one hidden layer:</p>

    <MathBlock
      expression={String.raw`X \longrightarrow Z^{[1]} \longrightarrow A^{[1]} \longrightarrow Z^{[2]} \longrightarrow A^{[2]} \longrightarrow \mathcal{L}`}
    />

    <p>
      The superscript in square brackets identifies the layer. It is not an exponent. For example,{" "}
      <InlineMath expression={String.raw`W^{[1]}`} /> contains the weights of the first layer and
      {" "}
      <InlineMath expression={String.raw`W^{[2]}`} /> contains the weights of the second layer.
    </p>

    <p>For a batch of training examples, the quantities have the following shapes:</p>

    <ul>
      <li>
        <InlineMath expression={String.raw`X`} /> — input features, shape <code>(n_x, m)</code>
      </li>
      <li>
        <InlineMath expression={String.raw`W^{[1]}`} /> — hidden-layer weights, shape <code>(n_h, n_x)</code>
      </li>
      <li>
        <InlineMath expression={String.raw`b^{[1]}`} /> — hidden-layer bias, shape <code>(n_h, 1)</code>
      </li>
      <li>
        <InlineMath expression={String.raw`Z^{[1]}, A^{[1]}`} /> — hidden-layer values, shape <code>(n_h, m)</code>
      </li>
      <li>
        <InlineMath expression={String.raw`W^{[2]}`} /> — output-layer weights, shape <code>(1, n_h)</code>
      </li>
      <li>
        <InlineMath expression={String.raw`b^{[2]}`} /> — output-layer bias, shape <code>(1, 1)</code>
      </li>
      <li>
        <InlineMath expression={String.raw`Z^{[2]}, A^{[2]}`} /> — output values, shape <code>(1, m)</code>
      </li>
      <li>
        <InlineMath expression={String.raw`Y`} /> — true labels, shape <code>(1, m)</code>
      </li>
    </ul>

    <p>
      Here, <InlineMath expression={String.raw`n_x`} /> is the number of input features,
      {" "}
      <InlineMath expression={String.raw`n_h`} /> is the number of neurons in the hidden layer, and
      each column in the input vector represents one training example.
    </p>

    <h2>Forward Propagation</h2>

    <p>The hidden layer first computes a linear transformation:</p>

    <MathBlock expression={String.raw`Z^{[1]} = W^{[1]}X + b^{[1]}`} />

    <p>
      The bias has shape <code>(n_h, 1)</code> and is added to every column in the batch (read about broadcasting). We then
      apply ReLU element by element:
    </p>

    <MathBlock
      expression={String.raw`A^{[1]} = \operatorname{ReLU}\left(Z^{[1]}\right)`}
    />

    <MathBlock expression={String.raw`\operatorname{ReLU}(z)=\max(0,z)`} />

    <p>The output layer uses the hidden activations as its input:</p>

    <MathBlock expression={String.raw`Z^{[2]} = W^{[2]}A^{[1]} + b^{[2]}`} />

    <p>Finally, sigmoid converts the output score into a probability:</p>

    <MathBlock
      expression={String.raw`A^{[2]} = \sigma\left(Z^{[2]}\right) = \frac{1}{1+e^{-Z^{[2]}}}`}
    />

    <p>For binary classification, the cost over the batch is:</p>

    <MathBlock
      expression={String.raw`J=-\frac{1}{m}\sum_{i=1}^{m}\left[y^{(i)}\log a^{[2](i)}+\left(1-y^{(i)}\right)\log\left(1-a^{[2](i)}\right)\right]`}
    />

    <h2>The Rule Used at Every Layer</h2>

    <p>
      Suppose a quantity <InlineMath expression={String.raw`u`} /> influences <InlineMath expression={String.raw`v`} />, and <InlineMath expression={String.raw`v`} /> eventually influences the cost. The chain rule says:
    </p>

    <MathBlock expression={String.raw`u \longrightarrow v \longrightarrow J`} />

    <MathBlock
      expression={String.raw`\frac{\partial J}{\partial u}=\frac{\partial J}{\partial v}\frac{\partial v}{\partial u}`}
    />

    <p>
      The first factor is the gradient arriving from later in the network. The second is the
      operation&apos;s local derivative. Backpropagation repeatedly multiplies an incoming gradient by
      a local derivative.
    </p>

    <p>Each layer therefore performs four tasks:</p>

    <ol>
      <li>Receive an incoming gradient from the next layer.</li>
      <li>Compute the local gradients of the layer&apos;s weights and bias.</li>
      <li>Multiply the incoming gradient by the local derivative.</li>
      <li>Pass the necessary gradient to the previous layer.</li>
    </ol>

    <h2>Backpropagation Through the Output Layer</h2>

    <p>
      The final part of the network is the same sigmoid and binary cross-entropy combination used
      in Part 1:
    </p>

    <MathBlock
      expression={String.raw`W^{[2]} \longrightarrow Z^{[2]} \longrightarrow A^{[2]} \longrightarrow J`}
    />

    <MathBlock
      expression={String.raw`b^{[2]} \longrightarrow Z^{[2]} \longrightarrow A^{[2]} \longrightarrow J`}
    />

    <p>Its derivative simplifies to:</p>

    <MathBlock
      expression={String.raw`\boxed{dZ^{[2]}=\frac{\partial J}{\partial Z^{[2]}}=A^{[2]}-Y}`}
    />

    <p>The gradients of the second layer&apos;s parameters are:</p>

    <MathBlock
      expression={String.raw`\boxed{dW^{[2]}=\frac{1}{m}dZ^{[2]}A^{[1]T}}`}
    />

    <MathBlock
      expression={String.raw`\boxed{db^{[2]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[2](i)}}`}
    />

    <p><em>(Please refer to Part-1 to understand how gradients are computed for the output layer as the same combination of sigmoid and binary cross-entropy is used.)</em></p>

    <p>
      Now observe carefully: for the hidden layer to calculate its gradients, it first needs{" "}
      <InlineMath expression={String.raw`dA^{[1]}=\frac{\partial J}{\partial A^{[1]}}`} />.
      For the output layer, the output activation <InlineMath expression={String.raw`A^{[2]}`} /> directly affects the
      loss <InlineMath expression={String.raw`J`} />, but the hidden activation <InlineMath expression={String.raw`A^{[1]}`} /> affects the loss indirectly through <InlineMath expression={String.raw`Z^{[2]}`} /> and <InlineMath expression={String.raw`A^{[2]}`} />, as shown below:
    </p>

    <MathBlock
      expression={String.raw`W^{[1]} \longrightarrow Z^{[1]} \longrightarrow A^{[1]} \longrightarrow Z^{[2]} \longrightarrow A^{[2]} \longrightarrow J`}
    />

    <p>
      Since we already have <InlineMath expression={String.raw`\frac{\partial J}{\partial Z^{[2]}}`} /> and can calculate <InlineMath expression={String.raw`\frac{\partial Z^{[2]}}{\partial A^{[1]}}`} />, we use the chain rule to calculate the gradient with respect to <InlineMath expression={String.raw`A^{[1]}`} />:
    </p>

    <MathBlock
      expression={String.raw`\frac{\partial J}{\partial A^{[1]}}=\frac{\partial Z^{[2]}}{\partial A^{[1]}}\frac{\partial J}{\partial Z^{[2]}}`}
    />

    <p>
      Because <InlineMath expression={String.raw`Z^{[2]}=W^{[2]}A^{[1]}+b^{[2]}`} />, this becomes:
    </p>

    <MathBlock
      expression={String.raw`\boxed{dA^{[1]}=\frac{\partial J}{\partial A^{[1]}}=W^{[2]T}dZ^{[2]}}`}
    />

    <p>This is the gradient <InlineMath expression={String.raw`dA^{[1]}`} /> that the output layer passes backward to the hidden layer.</p>

    <h2>Backpropagation Through the Hidden Layer</h2>

    <p>The hidden layer follows this path:</p>

    <MathBlock
      expression={String.raw`W^{[1]} \longrightarrow Z^{[1]} \longrightarrow A^{[1]} \longrightarrow Z^{[2]} \longrightarrow A^{[2]} \longrightarrow J`}
    />

    <p>
      We already have <InlineMath expression={String.raw`dA^{[1]}`} />. To continue through ReLU,
      we need its derivative:
    </p>

    <MathBlock
      expression={String.raw`\operatorname{ReLU}'(z)=\begin{cases}1, & z>0,\\0, & z<0.\end{cases}`}
    />

    <p>
      At zero, the derivative is undefined, but implementations conventionally choose a fixed
      value such as zero.
    </p>

    <p>Applying the chain rule element by element gives:</p>

    <MathBlock
      expression={String.raw`
    \frac{\partial J}{\partial Z^{[1]}}
    =
    \frac{\partial J}{\partial A^{[1]}}
    \frac{\partial A^{[1]}}{\partial Z^{[1]}}
    =
    \frac{\partial J}{\partial A^{[1]}}
    \odot
    \operatorname{ReLU}'\left(Z^{[1]}\right)
  `}
    />

    <MathBlock
      expression={String.raw`\boxed{dZ^{[1]}=dA^{[1]}\odot\operatorname{ReLU}'\left(Z^{[1]}\right)}`}
    />

    <p>Here <InlineMath expression={String.raw`dA^{[1]}`} /> is supplied by the next layer during the backward pass.</p>

    <p>
      The symbol <InlineMath expression={String.raw`\odot`} /> means element-wise multiplication.
      ReLU acts like a gate during backpropagation. A neuron whose pre-activation was positive
      passes its incoming gradient through. A neuron whose pre-activation was negative passes back
      zero for that example.
    </p>

    <p>The first layer&apos;s parameter gradients are:</p>

    <MathBlock
      expression={String.raw`\boxed{dW^{[1]}=\frac{1}{m}dZ^{[1]}X^T}`}
    />

    <MathBlock
      expression={String.raw`\boxed{db^{[1]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[1](i)}}`}
    />

    <p>If we wanted to continue into an earlier layer, the hidden layer would pass back:</p>

    <MathBlock
      expression={String.raw`
    \boxed{
      dA^{[l-1]} = W^{[l]T}dZ^{[l]}
    }
  `}
    />
    <p>Here <InlineMath expression={String.raw`l`} /> is the hidden layer index.</p>



    <p>This is the same formula used to pass a gradient backward from the output layer to the hidden layer.</p>



    <h2>The Complete Backward Pass</h2>

    <p>The entire calculation can be summarized as follows:</p>

    <MathBlock expression={String.raw`dZ^{[2]}=A^{[2]}-Y`} />
    <MathBlock
      expression={String.raw`dW^{[2]}=\frac{1}{m}dZ^{[2]}A^{[1]T}`}
    />
    <MathBlock
      expression={String.raw`db^{[2]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[2](i)}`}
    />
    <MathBlock expression={String.raw`dA^{[1]}=W^{[2]T}dZ^{[2]}`} />
    <MathBlock
      expression={String.raw`dZ^{[1]}=dA^{[1]}\odot\operatorname{ReLU}'\left(Z^{[1]}\right)`}
    />
    <MathBlock
      expression={String.raw`dW^{[1]}=\frac{1}{m}dZ^{[1]}X^T`}
    />
    <MathBlock
      expression={String.raw`db^{[1]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[1](i)}`}
    />

    <h2>Updating the Parameters</h2>

    <p>Gradient descent updates every trainable parameter:</p>

    <MathBlock
      expression={String.raw`W^{[1]}\leftarrow W^{[1]}-\alpha dW^{[1]}, \qquad b^{[1]}\leftarrow b^{[1]}-\alpha db^{[1]}`}
    />

    <MathBlock
      expression={String.raw`W^{[2]}\leftarrow W^{[2]}-\alpha dW^{[2]}, \qquad b^{[2]}\leftarrow b^{[2]}-\alpha db^{[2]}`}
    />

    <p>One training iteration consists of:</p>

    <ol>
      <li>Performing forward propagation.</li>
      <li>Computing the cost.</li>
      <li>Performing backpropagation.</li>
      <li>Updating the parameters.</li>
    </ol>

    <p>
      These steps repeat until the cost stops improving or another stopping condition is reached.
    </p>

    <h2>Why the Transpose Appears</h2>

    <p>
      The transpose in each weight-gradient equation is not an arbitrary matrix trick. For one
      example, a weight gradient is the error at the receiving neuron multiplied by the activation
      from the sending neuron.
    </p>

    <p>
      Across a batch, matrix multiplication calculates all of these products and sums the
      contributions from every example at once. The transpose arranges the examples so the batch
      dimension contracts, leaving one gradient for each weight.
    </p>

    <h2>What Changes With Another Activation Function?</h2>

    <p>
      Only the local activation derivative changes. If the hidden layer used an activation{" "}
      <InlineMath expression={String.raw`g`} /> instead of ReLU, then:
    </p>

    <MathBlock expression={String.raw`A^{[1]}=g\left(Z^{[1]}\right)`} />
    <MathBlock
      expression={String.raw`dZ^{[1]}=dA^{[1]}\odot g'\left(Z^{[1]}\right)`}
    />

    <p>
      The formulas for the weight gradient, bias gradient, and the gradient passed to the preceding
      layer remain the same. This is why neural networks can be constructed from different
      differentiable operations: each operation only needs to know how to transform its incoming
      gradient into an outgoing one.
    </p>

    <h2>Common Sources of Mistakes</h2>

    <p><strong>Mixing up element-wise and matrix multiplication:</strong></p>

    <p>
      Multiplying an incoming gradient by an activation derivative is element-wise. Computing a
      weight gradient uses matrix multiplication because it combines each neuron&apos;s error with each
      input activation.
    </p>

    <p><strong>Averaging more than once:</strong></p>

    <p>
      The factor <InlineMath expression={String.raw`1/m`} /> belongs in the parameter-gradient
      calculation when the cost is the mean loss over the batch. Applying it again to{" "}
      <InlineMath expression={String.raw`dZ`} /> would make the gradients too small.
    </p>

    <p><strong>Losing the bias dimensions:</strong></p>

    <p>
      Summing a bias gradient across the examples should preserve one value per neuron. Therefore,{" "}
      <InlineMath expression={String.raw`db^{[1]}`} /> must have shape <code>(n_h, 1)</code> and
      {" "}
      <InlineMath expression={String.raw`db^{[2]}`} /> must have shape <code>(1, 1)</code>.
    </p>

    <p><strong>Using updated weights during the same backward pass:</strong></p>

    <p>
      All gradients for an iteration describe the same forward pass. The complete backward pass
      should be calculated before any parameter is updated.
    </p>

    <p><strong>Forgetting the cached forward values:</strong></p>

    <p>
      Backpropagation needs values such as <InlineMath expression={String.raw`X`} />,{" "}
      <InlineMath expression={String.raw`Z^{[1]}`} />, and
      {" "}
      <InlineMath expression={String.raw`A^{[1]}`} />. These are normally saved during forward
      propagation and reused while moving backward.
    </p>

    <h2>Checking the Result</h2>

    <p>
      A useful mathematical check is to compare a backpropagation gradient with a numerical
      approximation. For a parameter <InlineMath expression={String.raw`\theta`} /> and a small
      number <InlineMath expression={String.raw`\varepsilon`} />:
    </p>

    <MathBlock
      expression={String.raw`\frac{\partial J}{\partial \theta}\approx\frac{J(\theta+\varepsilon)-J(\theta-\varepsilon)}{2\varepsilon}`}
    />

    <p>
      Numerical gradient checking is too expensive for normal training because it requires extra
      forward passes for every parameter. It is still valuable when verifying a new backward-pass
      derivation. If the analytical and numerical gradients disagree substantially, the backward
      pass likely contains a sign, transpose, scaling, or activation-derivative error.
    </p>

    <h2>From Two Layers to a Deep Network</h2>

    <p>
      Adding more hidden layers does not introduce a new backpropagation principle. It only repeats
      the same calculation more times. During forward propagation, layer{" "}
      <InlineMath expression={String.raw`l`} /> computes:
    </p>

    <MathBlock
      expression={String.raw`Z^{[l]}=W^{[l]}A^{[l-1]}+b^{[l]}, \qquad A^{[l]}=g^{[l]}\left(Z^{[l]}\right)`}
    />

    <p>During backpropagation, it computes:</p>

    <MathBlock
      expression={String.raw`dZ^{[l]}=dA^{[l]}\odot g^{[l]\prime}\left(Z^{[l]}\right)`}
    />

    <MathBlock
      expression={String.raw`dW^{[l]}=\frac{1}{m}dZ^{[l]}A^{[l-1]T}, \qquad db^{[l]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[l](i)}`}
    />

    <MathBlock expression={String.raw`dA^{[l-1]}=W^{[l]T}dZ^{[l]}`} />

    <p>
      Backpropagation is not a separate formula for every possible neural network. It is a
      systematic application of the chain rule, starting at the loss and moving backward through
      a sequence of local operations.
    </p>

    <p>
      Part 1 showed the pattern in a single neuron. This part showed how one layer passes a gradient
      to another. That repeated handoff is the foundation of training deep neural networks.
    </p>
  </>
);
