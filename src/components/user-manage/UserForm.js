import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
import myLocalStorage from '../../util/myLocalStorage'

const { Option } = Select
const UserForm = forwardRef((props, ref) => {
    // 是否禁用
    const [isDisabled, setisDisabled] = useState(false)

    useEffect(() => {
        // console.log(props.isUpdateDisabled);
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])

    const { roleId, region } = myLocalStorage.get('token_lh')
    // const { roleId, region } = JSON.parse(decodeURIComponent(window.atob(localStorage.getItem("token"))))
    const roleObj = {
        '1': 'superadmin',
        '2': 'admin',
        '3': 'editor'
    }
    const checkRegionDisabled = (item) => {
        // 如果是更新状态 除了超级管理员 其余都不允许修改region和role
        if (props.isUpdate) {
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return true
            }
        } else {
            // 如果是创建用户
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return item.value !== region
            }

        }
    }

    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return true
            }
        } else {
            // 如果是创建用户
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return roleObj[item.id] !== 'editor'
            }

        }
    }
    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item =>
                            <Option value={item.value} key={item.id}
                                disabled={checkRegionDisabled(item)}>{item.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select onChange={(value) => {
                    // value是roleId
                    // console.log(value)
                    if (value === 1) {
                        // 如果是超级管理员，区域就禁用
                        setisDisabled(true)
                        // 然后设置region值
                        ref.current.setFieldsValue({
                            region: ""
                        })
                    } else {
                        setisDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.id} key={item.id}
                                disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})
export default UserForm