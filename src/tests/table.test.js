import React from 'react';
import { mount, shallow } from 'enzyme';
import Table from 'src/components/table';

describe('<Table />', () => {
  it('matches snapshot', () => {
    const wrapper = mount(<Table />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders table', () => {
    const wrapper = shallow(<Table />);

    const tableElement = wrapper.find('table');
    expect(tableElement.exists()).toBeTruthy();
  });

  it('renders th', () => {
    const tempHeadList = [{text: '헤더', value: 'header'}];
    const wrapper = shallow(<Table head={tempHeadList}/>);

    const thElement = wrapper.find('th');
    expect(thElement.exists()).toBeTruthy();
  });

  it('renders td', () => {
    const tempHeadList = [{text: '헤더', value: 'header'}];
    const tempData = [{header: '테스트1'}, {header: '테스트2'}];
    const wrapper = shallow(<Table head={tempHeadList} data={tempData}/>);

    const tdElement = wrapper.find('td');
    expect(tdElement.exists()).toBeTruthy();
  });

  it('sort table', () => {
    const tempHeadList = [{text: '헤더', value: 'header', sort: 'header'}];
    const tempData = [{header: '테스트1'}, {header: '테스트2'}];
    let sortKey = undefined;
    let sortDesc = false;
    const onSort = (key, isDesc) => {
      sortKey = key;
      sortDesc = isDesc;
    }

    const wrapper = mount(<Table head={tempHeadList} data={tempData} onSort={onSort}/>);
    
    const thElement = wrapper.find('th');
    expect(thElement.exists()).toBeTruthy();

    thElement.simulate('click');
    expect(sortKey).toBe('header');
    expect(sortDesc).toBe(false);

    thElement.simulate('click');
    expect(sortKey).toBe('header');
    expect(sortDesc).toBe(true);

    thElement.simulate('click');
    expect(sortKey).toBe(undefined);
    expect(sortDesc).toBe(false);
  });
});