import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import NewsAdd from '../../views/sandbox/new-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/new-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/new-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../../views/sandbox/new-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/new-manage/NewsUpdate'

const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}


function NewsRouter(props) {

    const [BackRouteList, setBackRouteList] = useState([])

    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:5000/rights'),
            axios.get('http://localhost:5000/children'),
        ]).then(res => {
            //   console.log(res);
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])

    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }

    return (
        <Spin size="large" spinning={props.isSpining}>
            <Switch>
                {
                    BackRouteList.map(item => {
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact></Route>
                        }
                        return null
                    }
                    )
                }

                {/* 把模糊匹配改为了精确匹配，不然如果输入的是上面不曾出现过的路径也会一股脑都去/home  */}
                <Redirect from='/' to='/home' exact></Redirect>
                {
                    BackRouteList.length > 0 && <Route path='*' component={Nopermission}></Route>
                }

            </Switch>
        </Spin>
    )
}

const mapStateToProps = ({LoadingReducer:{isSpining}})=>{
    return {
        isSpining
    }
}

export default connect(mapStateToProps)(NewsRouter)