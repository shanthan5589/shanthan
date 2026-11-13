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

    <div className="flex flex-col items-center">
      <img
        src="/images/simple_nn.png"
        alt="Diagram of a neural network"
        className="max-h-100 max-w-full rounded-lg object-contain"
      />
      <p className="text-center italic">Fig: A neural network (grouping of neurons).</p>
    </div>

    <p>As you can see each neuron is this network is a single neuron which we saw in the previous part which was used to implement the logistic regression model. So
      you can think of each neuron in this network as a logistic regression model.
    </p>

    <p>
      In the following example, the network will use a ReLU activation in the hidden layer, a sigmoid activation in the
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
      <InlineMath expression={String.raw`n_h`} /> is the number of neurons in the hidden layer, and <InlineMath expression={String.raw`m`} /> is the number of training examples.
    </p>

    <h2>Forward Propagation</h2>

    <p>The hidden layer first computes a linear transformation:</p>

    <MathBlock
      expression={String.raw`Z^{[1]} = W^{[1]}X + b^{[1]} \qquad \text(n_h, m)`}
    />

    <p>
      The bias has shape <code>(n_h, 1)</code> and is added to every column in the batch (read about broadcasting). We then
      apply ReLU element by element:
    </p>

    <MathBlock
      expression={String.raw`A^{[1]} = \operatorname{ReLU}\left(Z^{[1]}\right) \qquad \text(n_h, m)`}
    />

    <MathBlock expression={String.raw`\operatorname{ReLU}(z)=\max(0,z)`} />

    <p>The output layer uses the hidden activations as its input:</p>

    <MathBlock expression={String.raw`Z^{[2]} = W^{[2]}A^{[1]} + b^{[2]} \qquad \text(1, m)`} />

    <p>Finally, sigmoid converts the output score into a probability:</p>

    <MathBlock
      expression={String.raw`A^{[2]} = \sigma\left(Z^{[2]}\right) = \frac{1}{1+e^{-Z^{[2]}}}  \qquad \text(1, m)`}
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
      expression={String.raw`\boxed{dZ^{[2]}=\frac{\partial J}{\partial Z^{[2]}}=A^{[2]}-Y} \qquad \text(1, m)`}
    />

    <p>The gradients of the second layer&apos;s parameters are:</p>

    <MathBlock
      expression={String.raw`\boxed{dW^{[2]}=\frac{1}{m}dZ^{[2]}A^{[1]T}}  \qquad \text(1, n_h)`}
    />

    <MathBlock
      expression={String.raw`\boxed{db^{[2]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[2](i)}} \qquad \text(1, 1)`}
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
      expression={String.raw`\boxed{dA^{[1]}=\frac{\partial J}{\partial A^{[1]}}=W^{[2]T}dZ^{[2]}} \qquad \text(n_h, m)`}
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
      expression={String.raw`\boxed{dZ^{[1]}=dA^{[1]}\odot\operatorname{ReLU}'\left(Z^{[1]}\right)}  \qquad \text(n_h, m)`}
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
      expression={String.raw`\boxed{dW^{[1]}=\frac{1}{m}dZ^{[1]}X^T}  \qquad \text(n_h, n_x)`}
    />

    <MathBlock
      expression={String.raw`\boxed{db^{[1]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[1](i)}} \qquad \text(n_h, 1)`}
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

    <MathBlock expression={String.raw`dZ^{[2]}=A^{[2]}-Y  \qquad \text(1, m)`} />
    <MathBlock
      expression={String.raw`dW^{[2]}=\frac{1}{m}dZ^{[2]}A^{[1]T} \qquad \text(1, n_h)`}
    />
    <MathBlock
      expression={String.raw`db^{[2]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[2](i)} \qquad \text(1, 1)`}
    />
    <MathBlock expression={String.raw`dA^{[1]}=W^{[2]T}dZ^{[2]} \qquad \text(n_h, m)`} />
    <MathBlock
      expression={String.raw`dZ^{[1]}=dA^{[1]}\odot\operatorname{ReLU}'\left(Z^{[1]}\right) \qquad \text(n_h, m)`}
    />
    <MathBlock
      expression={String.raw`dW^{[1]}=\frac{1}{m}dZ^{[1]}X^T \qquad \text(n_h, n_x)`}
    />
    <MathBlock
      expression={String.raw`db^{[1]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[1](i)} \qquad \text(n_h, 1)`}
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

    <h2>Let's generalize for all activation functions and loss functions</h2>

    <p>Most of the equations remain same, but I have written all of them again just to keep everything in one place.</p>

    <p>
      Let <InlineMath expression={String.raw`L`} /> be the loss function and{" "}
      <InlineMath expression={String.raw`\sigma^{[1]}`} /> be the activation function for the hidden layer and{" "}
      <InlineMath expression={String.raw`\sigma^{[2]}`} /> be the activation function for the output layer. Then the equations for backpropagation are:
    </p>

    <MathBlock
      expression={String.raw`Z^{[1]} = W^{[1]}X + b^{[1]} \qquad \text(n_h, m)`}
    />

    <MathBlock
      expression={String.raw`A^{[1]}=\sigma^{[1]}\left(Z^{[1]}\right) \qquad \text(n_h, m)`}
    />
    <MathBlock
      expression={String.raw`Z^{[2]}=W^{[2]}A^{[1]}+b^{[2]} \qquad \text(1, m)`}
    />
    <MathBlock
      expression={String.raw`A^{[2]}=\sigma^{[2]}\left(Z^{[2]}\right) \qquad \text(1, m)`}
    />

    <MathBlock
      expression={String.raw`dZ^{[2]}=\frac{\partial L}{\partial A^{[2]}}\sigma^{[2]\prime}\left(Z^{[2]}\right) \qquad \text(1, m)`}
    />
    <MathBlock
      expression={String.raw`dW^{[2]}=\frac{1}{m}dZ^{[2]}A^{[1]T} \qquad \text(1, n_h)`}
    />
    <MathBlock
      expression={String.raw`db^{[2]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[2](i)} \qquad \text(1, 1)`}
    />
    <MathBlock expression={String.raw`dA^{[1]}=W^{[2]T}dZ^{[2]} \qquad \text(n_h, m)`} />
    <MathBlock
      expression={String.raw`dZ^{[1]}=dA^{[1]}\odot\sigma^{[1]\prime}\left(Z^{[1]}\right) \qquad \text(n_h, m)`}
    />
    <MathBlock
      expression={String.raw`dW^{[1]}=\frac{1}{m}dZ^{[1]}X^T \qquad \text(n_h, n_x)`}
    />
    <MathBlock
      expression={String.raw`db^{[1]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[1](i)} \qquad \text(n_h, 1)`}
    />

    <p>
      These equations can be scaled to any number of layers. The only difference is that the network can have any loss function and the activation function can be different for each layer.
      So using these same equation we will try to generalize for any number of layers in the next part of this series.
    </p>

  </>
);
