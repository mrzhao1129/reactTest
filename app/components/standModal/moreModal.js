//更多页，table展示
import React, { Component } from 'react';
import { Modal } from 'antd';

import './style.less'

class moreModal extends Component {
  reTable = () => {
    let itemArr = this.props.children;
    let trArr = [];
    let singleNum = 0;
    for(let i = 0; i < itemArr.length; i++) {
      if(i === itemArr.length - 1) {
        trArr.push(<tr className={singleNum % 2 === 0 ? 'single' : ''} key={i}><th>{itemArr[i].label + ':'}</th>
          <td>{typeof(itemArr[i].init) === undefined ? '' : itemArr[i].init}</td><th></th><td></td></tr>);
      }else {
        trArr.push(<tr className={singleNum % 2 === 0 ? 'single' : ''} key={i}><th>{itemArr[i].label + ':'}</th>
          <td>{typeof(itemArr[i].init) === undefined ? '' : itemArr[i].init}</td>
          <th>{itemArr[i + 1].label + ':'}</th>
          <td>{typeof(itemArr[i + 1].init) === undefined ? '' : itemArr[i + 1].init}</td></tr>);
      }
      singleNum ++;
      i++;
    }
    return trArr;
  }
  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        title={this.props.title}
        footer={null}
        confirmLoading={false}//确定按钮 loading
        className="comp_moreModal"
        width="800"
      >
        <table>
          <tbody>
            { this.reTable() }
          </tbody>
        </table>
      </Modal>
    );
  }
}

export default moreModal;