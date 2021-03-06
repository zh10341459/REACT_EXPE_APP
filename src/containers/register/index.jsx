import React from 'react';
import { NavBar, Icon, InputItem, WhiteSpace, Button, WingBlank, Toast } from 'antd-mobile';
// import { createForm } from 'rc-form';
import './index.less';
import { Link } from "react-router-dom";
import { baseAxios } from '../../utils/axios';
import history from '../../utils/history'
import cookies from 'react-cookies'
import { userAuthSuccess } from '../../redux/actions'
import { connect } from 'react-redux'
/**
 * 注册
 */
class Register extends React.Component {
  state = {
    account: '',
    password: '',
    nickName: ''
  }

  handleChange = (stateName, val) => {
    this.setState({ [stateName]: val })
  }

  login = async () => {
    try
    {
      const result = await baseAxios.post('/users', this.state);
      if (result.status && result.status === 200)
      {
        const {user, token} = result.data
        Toast.success('注册成功');
        this.props.userAuthSuccess(user)
        // 将token存储到cookie中
        cookies.save('token', token)
        history.push('/')
      }else{
        Toast.fail(`${result.response.data.message}`)
      }
    } catch (err)
    {
      Toast.fail(`注册失败：${err}`)
    }
  }

  render () {
    return <div>
      <NavBar
        mode="dark"
        leftContent={<Icon type="cross"></Icon>}
        rightContent={<Link to='/login' style={{ color: 'white' }}>密码登录</Link>}
      >注册</NavBar>
      <WhiteSpace size="lg" />
      <div className='top_bg_div'>

      </div>
      <WhiteSpace size="xl" />
      <form>
        <InputItem
          type='text'
          // defaultValue={100}
          placeholder="请输入账号"
          moneyKeyboardAlign="left"
          onChange={val => this.handleChange('account', val)}
          autoComplete="off"
        >账号</InputItem>

        <InputItem
          type='password'
          // defaultValue={100}
          placeholder="请输入密码"
          moneyKeyboardAlign="left"
          onChange={val => this.handleChange('password', val)}
          autoComplete="off"
        >密码</InputItem>

        <InputItem
          type='text'
          // defaultValue={100}
          placeholder="请输入昵称"
          moneyKeyboardAlign="left"
          onChange={val => this.handleChange('nickName', val)}
        >昵称</InputItem>
        <WhiteSpace size="xl" />
        <WingBlank>
          <Button type="primary" onClick={this.login}>注册</Button><WhiteSpace />
        </WingBlank>
      </form>
      <p style={{ color: '#BBBBBB', fontSize: '12px', textAlign: "center" }}>
        未注册或未绑定哔哔哩哩的手机号，将帮你注册新账号
                <br />
                登录即代表你同意<span className='primary-color'>用户协议</span>和<span className='primary-color'>隐私政策</span>

        <br />
        <br />
                遇到问题？<span className='primary-color'>查看帮助</span>
      </p>
    </div>
  }
}

// const RegisterCon = createForm()(Register);
// export default RegisterCon;
export default connect(
  state => state,
  { userAuthSuccess }
)(Register)