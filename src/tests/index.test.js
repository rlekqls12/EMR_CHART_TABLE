import React from 'react';
import { mount } from 'enzyme';
import Index from 'pages/index';

describe('<Index />', () => {
  it('matches snapshot', () => {
    const wrapper = mount(<Index />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders div', () => {
    const wrapper = mount(<Index />);

    const tableElement = wrapper.find('table');
    expect(tableElement).toBeTruthy();
  });
});