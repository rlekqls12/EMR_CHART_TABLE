import React from 'react';
import { mount, shallow } from 'enzyme';
import Pagination from 'src/components/pagination';

describe('<Pagination />', () => {
  it('matches snapshot', () => {
    const wrapper = mount(<Pagination />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders pagination', () => {
    let nowPage = 1;
    const onPageChange = (now) => nowPage = now;
    const wrapper = mount(<Pagination initialPage={1} maxPage={2} showPageList={2} onPageChange={onPageChange} />);

    const divElement = wrapper.find('div');
    expect(divElement.exists()).toBeTruthy();

    const prevPageElement = wrapper.findWhere(node =>
      node.type() === 'button' && node.text() === '◀'
    );
    expect(prevPageElement.exists()).toBeTruthy();

    const nextPageElement = wrapper.findWhere(node =>
      node.type() === 'button' && node.text() === '▶'
    );
    expect(nextPageElement.exists()).toBeTruthy();

    prevPageElement.simulate('click');
    expect(nowPage).toBe(1);

    nextPageElement.simulate('click');
    expect(nowPage).toBe(2);

    nextPageElement.simulate('click');
    expect(nowPage).toBe(2);

    prevPageElement.simulate('click');
    expect(nowPage).toBe(1);

    const page2Element = wrapper.findWhere(node =>
      node.type() === 'span' && node.text() === '2'
    );
    expect(page2Element.exists()).toBeTruthy();
    page2Element.simulate('click');
    expect(nowPage).toBe(2);
  });
});