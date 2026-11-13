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

export const backpropagationPart3 = (
  <>

  <p>In the previous part, we derived the equations for forward and backpropagation in a two-layer neural network. In this part, we will generalize these equations to any number of layers.</p>

  <p>The following equations have been derived in the previous part.</p>
  
  <p>
      Let <InlineMath expression={String.raw`L`} /> be the loss function and{" "}
      <InlineMath expression={String.raw`\sigma^{[1]}`} /> be the activation function for the hidden layer and{" "}
      <InlineMath expression={String.raw`\sigma^{[2]}`} /> be the activation function for the output layer.
    </p>

    <p>
      Here, <InlineMath expression={String.raw`n_x`} /> is the number of input features,
      {" "}
      <InlineMath expression={String.raw`n_h`} /> is the number of neurons in the hidden layer, and <InlineMath expression={String.raw`m`} /> is the number of training examples.
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


    <p>Now we will generalize these equations to any number of layers.</p>

    <p>
      Let <InlineMath expression={String.raw`L`} /> be the loss function and{" "}
      <InlineMath expression={String.raw`\sigma^{[l]}`} /> be the activation function and <InlineMath expression={String.raw`n_h^{[l]}`} /> be the number of neurons for the{" "}
      <InlineMath expression={String.raw`l^{\text{th}}`} /> layer, then the equations for forward and backpropagation are:
    </p>

    <MathBlock
      expression={String.raw`Z^{[l]} = W^{[l]}X + b^{[l]} \qquad \text(n_h^{[l]}, m)`}
    />

    <MathBlock
      expression={String.raw`A^{[l]}=\sigma^{[l]}\left(Z^{[l]}\right) \qquad \text(n_h^{[l]}, m)`}
    />

    <MathBlock
      expression={String.raw`dZ^{[l]}=\frac{\partial L}{\partial A^{[l]}}\sigma^{[l]\prime}\left(Z^{[l]}\right) \qquad \text(n_h^{[l]}, m)`}
    />
    <MathBlock
      expression={String.raw`dW^{[l]}=\frac{1}{m}dZ^{[l]}A^{[l-1]T} \qquad \text(n_h^{[l]}, n_h^{[l-1]})`}
    />
    <MathBlock
      expression={String.raw`db^{[l]}=\frac{1}{m}\sum_{i=1}^{m}dZ^{[l](i)} \qquad \text(n_h^{[l]}, 1)`}
    />
    <MathBlock
      expression={String.raw`dA^{[l-1]}=W^{[l]T}dZ^{[l]} \qquad \text(n_h^{[l]}, m)`}
    />

    <p></p>

    <p><InlineMath expression={String.raw`dA^{[l-1]}`} /> is passed to the previous layer and becomes the incoming gradient to the previous layer.</p>


    
  </>
);
