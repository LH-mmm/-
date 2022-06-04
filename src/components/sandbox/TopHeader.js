import React from 'react'
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader(props) {
    // console.log(props);
    // const [collapsed, setcollapsed] = useState(false)
    const changeCollapsed = () => {
        props.changeCollapsed()
    }

    const {role:{roleName}, username} = JSON.parse(localStorage.getItem('token'))
    const menu = (
        <Menu
            items={[
                {
                    label: roleName,
                },
                {
                    danger: true,
                    label: '退出',
                    onClick:()=>{
                        localStorage.removeItem('token')
                        props.history.replace('/login')
                    }
                },
            ]}
        />
    );
    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>

            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> :
                    <MenuFoldOutlined onClick={changeCollapsed} />
            }

            <div style={{ float: 'right' }}>
                <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar
                        style={{
                            backgroundColor: '#87d068',
                        }}
                        icon={<UserOutlined />}
                    />
                </Dropdown>
            </div>
        </Header>
    )
}

/*
connect(
    //第一个参数 mapStateToProps:把redux中的状态映射成自己的属性 是一个函数,可以接受到reducer里的state，返回的是一个对象
    //第二个参数 mapDispatchToProps:把Dispatch方法映射为自己的属性 是一个对象 里面放的是很多函数 函数返回的是一个包含了type的对象
)(被包装的组件)
*/

const mapStateToProps = ({CollapsedReducer:{isCollapsed}})=>{
    // console.log(state);
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed(){
        return {
            type: 'change_collapsed'
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))