// old
const jsx_1 = (
  { type: 'div', props: { className: 'container' }, children: [
    { type: 'h1', props: {}, children: ['Hello'] },
    { type: 'h2', props: {onClick: () => console.log('hey I am and h2!')}, children: ['World!'] },
    { type: 'ul', props: {}, children: [
      { type: 'li', props: {}, children: ['item 1'] },
      { type: 'li', props: {}, children: ['item 2'] }
    ] } ] }
);

// new
const jsx_2 = (
  { type: 'div', props: { className: 'container' }, children: [
    { type: 'h1', props: {}, children: ['Hello'] },
    { type: 'h2', props: {}, children: ['World!'] },
    { type: 'ul', props: {}, children: [
      //{ type: 'li', props: {}, children: ['item 1'] },
      { type: 'li', props: {}, children: ['I changed!'] } 
    ] } ] }
);

// helper functions

const changed = (node1, node2) => ( 
  typeof node1 !== typeof node2 ||
  typeof node1 === 'string' && node1 !== node2 ||
  node1.type !== node2.type
);

const isEventProp = name => (
  /^on/.test(name)
);

const getEventName = name => (
  R.compose(R.toLower, R.slice)(2, Infinity, name)
); 

const toElement = node => createElement(node); 
const append_Child = (el, node) => el.appendChild(node);

// transform jS object to Node Tree

function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  setProps($el, node.props);
  addEventListeners($el, node.props);
  R.pipe(R.map(toElement), R.forEach(R.partial(append_Child, [$el])))(node.children);
  return $el;
}

// diffing algorithm to compare vDOM changes

function updateElement($parent, newNode, oldNode, index = 0) {
  if(!oldNode) {
    $parent.appendChild(createElement(newNode));
  } else if(!newNode) {
    $parent.removeChild($parent.childNodes[index]);
  } else if(changed(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index])
    // continue checking
  } else if(newNode.type) {
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    const update_Element = (_index, node, i) => (
      updateElement($parent.childNodes[_index], 
        newNode.children[i], 
        oldNode.children[i], 
        i
      )
    );
    (newLength > oldLength ? newNode.children : oldNode.children)
      .forEach(R.partial(update_Element, [index]));
  }
}

// handle props

function setProps($el, props) {
  const set_Props = (value, key) => {
    if(key === 'className') {
      $el.setAttribute('class', value);
    } else {
      $el.setAttribute(key, value);
    }
  }
  R.forEachObjIndexed(set_Props, props);
}

// handle events

function addEventListeners($target, props) {
  const add_EventListeners = (value, key) => {
    if(isEventProp(key)) {
      console.log(getEventName(key), value)
      $target.addEventListener(getEventName(key), value)
    }
  }
  R.forEachObjIndexed(add_EventListeners, props);
}

const $root = document.getElementById('root');
$root.appendChild(createElement(jsx_1));
setTimeout(function() {
  updateElement($root, jsx_2, jsx_1)
}, 1000)
