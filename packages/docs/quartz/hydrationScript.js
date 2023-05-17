import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import document from './document';
import component from '__COMPONENT_PATH';
const data = __BUILD_TIME_DATA;

const domNode = document.getElementById('quartz-body');
hydrateRoot(domNode, React.createElement(component, { data }, component));
