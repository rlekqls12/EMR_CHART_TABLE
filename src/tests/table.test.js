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
    
    // const thElement = wrapper.findWhere(node =>
    //   node.type() === 'th' && node.text() === 'header'
    // );
    const thElement = wrapper.find('th');
    expect(thElement.exists()).toBeTruthy();

    thElement.at(0).simulate('click');
    expect(sortKey).toBe('header');
    expect(sortDesc).toBe(false);

    thElement.at(0).simulate('click');
    expect(sortKey).toBe('header');
    expect(sortDesc).toBe(true);

    thElement.at(0).simulate('click');
    expect(sortKey).toBe(undefined);
    expect(sortDesc).toBe(false);
  });

  it('filter table', () => {
    const tempHeadList = [{
      text: '헤더', 
      value: 'header', 
      sort: 'header', 
      filter: {
        key: 'header',
        type: 'text'
      }
    }];
    const tempData = [{header: '테스트1'}, {header: '테스트2'}];
    let filterKey = undefined;
    let filterValue = undefined;
    const onFilter = (key, value) => {
      filterKey = key;
      filterValue = value;
    }

    const wrapper = mount(<Table head={tempHeadList} data={tempData} onFilter={onFilter}/>);

    const filterElement = wrapper.find('input');
    expect(filterElement.exists()).toBeTruthy();

    filterElement.simulate('change', {
      target: {
        value: '테스트'
      }
    });
    filterElement.simulate('keydown', { key: 'Enter' });
    expect(filterKey).toBe('header');
    expect(filterValue).toBe('테스트');
  });
});