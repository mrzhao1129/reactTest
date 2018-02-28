import React, { Component } from 'react';

export default function lazyLoader (importComponent) {
  class AsyncComponent extends Component {
    state = { Component: null }

    async componentDidMount () {
      const { default: Component } = await importComponent();

      this.setState({
        Component: Component
      });
    }

    render () {
      const Component = this.state.Component;

      return Component
        ? <Component {...this.props} />
        : null;
    }
  }

  return AsyncComponent;
};
class Bundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mod: null
    };
  }

  // componentWillMount() {
  //   this.load(this.props)
  // }

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  //   console.log(this.props);
  //   if (nextProps.load !== this.props.load) {
  //     this.load(nextProps)
  //   }
  // }

  // load(props) {
  //   this.setState({
  //     mod: null
  //   });
  //   //注意这里，使用Promise对象; mod.default导出默认
  //   props.load().then((mod) => {
  //     this.setState({
  //       mod: mod.default ? mod.default : mod
  //     });
  //   });
  // }
  async componentDidMount() {
    const { default: mod } = await this.props.load();
    this.setState({
      mod: mod.default || mod,
    });
  }
  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }
}