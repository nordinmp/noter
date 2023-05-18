import { h, hydrate } from 'preact';
const hydrationDataNode = document.getElementById('__QUARTZ_HYDRATION_DATA__');
const renderedHTMLString = document.getElementById('__QUARTZ_HYDRATION_DATA__').innerHTML;
const data = JSON.parse(hydrationDataNode.innerText);
const element = h(component, { data, renderedHTMLString })
const domNode = document.getElementById('quartz-body');
hydrate(element, domNode);
