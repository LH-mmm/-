import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import './index.css'
import { withRouter } from 'react-router-dom'
import {
    AppstoreOutlined,
    PieChartOutlined,
    ContainerOutlined
} from '@ant-design/icons';
import axios from 'axios';
import {connect} from 'react-redux'

const { Sider } = Layout;


function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

// const items = [
//     getItem('首页', '/home', <PieChartOutlined />),
//     // getItem('Option 2', '2', <DesktopOutlined />),
//     // getItem('Option 3', '3', <ContainerOutlined />),
//     getItem('用户管理', '/user-manage', <MailOutlined />, [
//         getItem('用户列表', '/user/manage/list'),
//         // getItem('Option 6', '6'),
//         // getItem('Option 7', '7'),
//         // getItem('Option 8', '8'),
//     ]),
//     getItem('权限管理', '/right-manage', <AppstoreOutlined />, [
//         getItem('角色列表', '/right-manage/role/list'),
//         getItem('权限列表', '/right-manage/right/list'),
//     ]),
// ]; 

function SideMenu(props) {
    const [menus, setmenus] = useState([])

    const iconList = {
        '/home': <AppstoreOutlined />,
        '/user-manage': <PieChartOutlined />,
        '/right-manage': <ContainerOutlined />
    }

    // 解构当前用户
    const {role:{rights}} = JSON.parse(localStorage.getItem('token'))
    const checkPagePermission = (item) => {
        return item.pagepermisson && rights.includes(item.key)
    }
    const renderMenu = (menulist) => {
        return menulist.map(item => {
            // console.log(item);
            if (item.children?.length > 0 && checkPagePermission(item)) {
                return getItem(item.title, item.key, iconList[item.key], renderMenu(item.children))
            }
            return checkPagePermission(item) && getItem(item.title, item.key, iconList[item.key])
        })
    }

    useEffect(() => {
        axios.get('http://localhost:5000/rights?_embed=children').then(res => {
            // console.log(res.data);
            setmenus(res.data);
        })
    }, [])
    const selectKeys = [props.location.pathname]
    const openKeys = ['/' + props.location.pathname.split('/')[1]]
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                <div className="logo">全球新闻发布管理系统</div>
                <div style={{flex:1, overflow:'auto'}}>
                    <Menu
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}
                        mode="inline"
                        theme="dark"
                        // inlineCollapsed={props.isCollapsed}
                        items={renderMenu(menus)}
                        onClick={item => {
                            // console.log(item);
                            props.history.push(item.key)
                        }}
                    />
                </div>
            </div>
        </Sider>
    )
}

const mapStateToProps = ({CollapsedReducer:{isCollapsed}})=>{
    // console.log(state);
    return {
        isCollapsed
    }
}

export default connect(mapStateToProps)(withRouter(SideMenu))