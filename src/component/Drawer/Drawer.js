import React, { Component } from 'react';
import { Drawer, Button, Space, Input } from 'antd';

import './Drawer.css';

class ListDrawer extends Component {
  state = { 
    visible: false, 
    placement: 'bottom',
    list: this.props.countrySummary,
    input: '' 
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onCountry = (data) => {
      this.props.currentCountry(data);
      this.onClose();
  }

  onChange = e => {
    this.setState({ input: e.target.value.toLowerCase() });
  };

  render() {
    const { placement, visible } = this.state;
    const list = (
      this.props.countrySummary
      .filter(item => this.state.input === '' || item.location.toLowerCase().includes(this.state.input))
      .map((item, i) => (
          <p onClick={() => this.onCountry(item.location)} key={i}>
            <img src={`https://www.countryflags.io/${item.country_code}/flat/32.png`} alt="Flag" />{' '}
            {item.location}
          </p>
      ))
    );
    let className = 'custom-drawer-light';
    if(this.props.dark)
      className = 'custom-drawer-dark'
    return (
      <>
        <Space>
            <Button onClick={this.showDrawer} style={{ border: 'none', background: 'transparent' }}>
                <img src="https://img.icons8.com/doodle/48/000000/country.png" alt="country"/>
            </Button>
        </Space>
        <Drawer
          className={className}
          title="Countries"
          placement={placement}
          closable={false}
          onClose={this.onClose}
          visible={visible}
          key={placement}
          height="60vh"
          headerStyle={{ background: this.props.bg, color: this.props.color, fontSize: '2rem' }}
          bodyStyle={{ background: this.props.bg, color: this.props.color }}
        >
            <Input size="middle" placeholder="Search Country..." onChange={this.onChange} style={{ marginBottom: '5px' }}/>
            {list}
        </Drawer>
      </>
    );
  }
}

export default ListDrawer;
