import React from 'react';
import { TabBar, NavBar } from 'antd-mobile'
import {
  FirstPage,
  FirstFullPage, Self, SelfFull, NewInfo, NewInfoFull, Person, PersonFull, MsgCircle, MsgCircleFull, Plus
} from '../../utils/importSvg';
import './main.less';
import PersonalInfo from '../personalInfo/personalInfo'
import Cookies from 'react-cookies'
import { Redirect, Switch, Route, Router, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { userAuthSuccess } from '../../redux/actions'
import { baseAxios } from '../../utils/axios'
import NotFound from "../../components/notFound/notFound";
import history from '../../utils/history'
import FriendList from '../friendList/friendList'
import AddFriend from '../addFriend/addFriend'

class Main extends React.Component {
  state = {
    selectedTab: '/firstPage',
    hidden: false,
    fullScreen: false,
    tabIcons: [
      { title: '首页', tabName: '/firstPage', icon: FirstPage, activeIcon: FirstFullPage, component: <div>22</div> },
      { title: '通讯录', tabName: '/friendList', icon: Person, activeIcon: PersonFull, component: <div>33</div> },
      { title: '动态', tabName: '/activeNews', icon: NewInfo, activeIcon: NewInfoFull, component: <div>44</div> },
      { title: '消息', tabName: '/buy', icon: MsgCircle, activeIcon: MsgCircleFull, component: <div>44</div> },
      { title: '我的', tabName: '/personalInfo', icon: Self, activeIcon: SelfFull, component: <PersonalInfo></PersonalInfo> },
    ]
  };

  async componentDidMount () {
    const { _id } = this.props.user;
    const token = Cookies.load('token')
    if (token && !_id)
    {
      const {data : user} = await baseAxios.get(`/users/token/${token}`)
      this.props.userAuthSuccess(user)
    }

    const { pathname } = this.props.location;
    this.setState({ selectedTab: pathname })
  }

  render () {
    // 如果没有token信息，则跳转到登录页面
    const token = Cookies.load('token');
    if (!token)
    {
      return <Redirect to='/login' />
    }
    // 如果有token，redux里没有_id，则自动获取用户信息保存到redux中
    const { tabIcons } = this.state;

    return (
      <div style={{ height: '100%' }}>
        <div className='content-box'>
          <Router history={history}>
            <Switch>
              <Route path='/friendList' component={props => <FriendList  {...props} />}></Route>
              <Route path='/personalInfo' component={props => <PersonalInfo  {...props} />}></Route>
              <Route component={NotFound}></Route>
            </Switch>
          </Router>
        </div>

        <TabBar
          unselectedTintColor="#A2A2A2"
          tintColor="#FB7299"
          barTintColor="white"
          hidden={false}
        >
          {
            tabIcons.map((item, index) => (
              <TabBar.Item title={item.title}
                key={index}
                icon={<img className='tab-icon-img' src={item.icon} alt='' />}
                selectedIcon={<img className='tab-icon-img' src={item.activeIcon} alt='' />}
                selected={this.state.selectedTab === item.tabName}
                onPress={() => {
                  this.setState({ selectedTab: item.tabName })
                  history.replace(item.tabName);
                }} />
            ))
          }
        </TabBar>
      </div>
    )
  }
}

export default withRouter(connect(
  state => state,
  { userAuthSuccess }
)(Main))