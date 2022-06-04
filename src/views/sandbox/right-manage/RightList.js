import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal,Popover,Switch } from 'antd';
import axios from 'axios';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;

export default function RightList() {
  const [dataSource, setdataSource] = useState([])

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
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      // 同步后端（不然每次刷新页面又会回到初始状态）
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else {
      // console.log(item.rightId);  根据rightId找到它的父元素
      let list = dataSource.filter(data => data.id === item.rightId)
      // 浅拷贝 其实这个时候dataSource已经改变了
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setdataSource([...dataSource])
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    }

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
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color='gold'>{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirms(item)} />
            <Popover content={<div style={{textAlign:'center'}}>
              <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch>
            </div>} title="页面配置项" trigger={item.pagepermisson===undefined?'':'click'}>
              <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined}/>
            </Popover>

          </div>
        )
      }
    },
  ];

  const switchMethod = (item)=>{
    item.pagepermisson = item.pagepermisson===1? 0:1
    setdataSource([...dataSource])
    // 同步后端
    if(item.grade===1){
      axios.patch(`http://localhost:5000/rights/${item.id}`,{
        pagepermisson: item.pagepermisson
      })
    }else{
      axios.patch(`http://localhost:5000/children/${item.id}`,{
        pagepermisson: item.pagepermisson
      })
    }
  }
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      const list = res.data;
      list.forEach(item => {
        if (item.children?.length === 0) item.children = '';
      });
      setdataSource(list)
    })
  }, [])
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
