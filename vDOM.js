const jsx = (
  { type: 'div', props: { className: 'container' }, children: [
    { type: 'h1', props: {}, children: ['Hello'] },
    { type: 'h2', props: {}, children: ['World!'] },
    { type: 'ul', props: {}, children: [
      { type: 'li', props: {}, children: ['item 1'] },
      { type: 'li', props: {}, children: ['item 2'] }
    ] } ] }
);

function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  for(let cNode of node.children) {
    $el.appendChild(createElement(cNode));
  }
  return $el;
}

console.log(createElement(jsx));
