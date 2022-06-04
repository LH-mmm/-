import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [rightList, setrightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  const [isModalVisible, setisModalVisible] = useState(false)

  const confirms = (item) => {
    confirm({
      title: '您确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: '确认',
      // okType: 'danger',
      cancelText: '取消',
      onOk() {
        // console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 删除数据
  const deleteMethod = (item) => {
    console.log(item);
    // 当前页面同步状态 + 后端同步
    // 要不改变原数组 因此采用filter
    setdataSource(dataSource.filter(data => data.id !== item.id))
    // 同步后端（不然每次刷新页面又会回到初始状态）
    axios.delete(`http://localhost:5000/roles/${item.id}`)

  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirms(item)} />
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
              setisModalVisible(true)
              setcurrentRights(item.rights)
              setcurrentId(item.id)
            }} />

          </div>
        )
      }
    }
  ]

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then(res => {
      // console.log(res.data);
      setdataSource(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      // console.log(res.data);
      setrightList(res.data)
    })
  }, [])

  const handleOk = () => {
    // console.log(currentRights);
    setisModalVisible(false)
    // 同步datasource
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return{
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    // 同步后端数据
    // patch
    axios.patch(`http://localhost:5000/roles/${currentId}`,{
      rights:currentRights
    })
    
  }

  const handleCancel = () => {
    setisModalVisible(false)
  }

  const onCheck = (checkKeys) => {
    // console.log(checkKeys);
    setcurrentRights(checkKeys.checked)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        rowKey={(item) => item.id}></Table>

      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly = {true}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
