import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, notification } from 'antd';
import axios from 'axios';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined
} from '@ant-design/icons';
import myLocalStorage from '../../../util/myLocalStorage'

const { confirm } = Modal;

export default function NewsDraft(props) {
  const [dataSource, setdataSource] = useState([])

  // const myLocalStorage = new MyLocalStorage()
  const { username } = myLocalStorage.get('token_lh')
  // const { username } = JSON.parse(decodeURIComponent(window.atob(localStorage.getItem("token"))))

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
    axios.delete(`/news/${item.id}`)

  }

  const handleCheck = (item) => {
    axios.patch(`/news/${item.id}`, {
      auditState: 1
    }).then(res => {
      props.history.push('/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到审核列表中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
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
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirms(item)} />

            <Button shape="circle" icon={<EditOutlined />} onClick={() => {
              props.history.push(`/news-manage/update/${item.id}`)
            }} />
            <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleCheck(item)} />

          </div>
        )
      }
    },
  ];


  useEffect(() => {
    axios.get(`news?author=${username}&auditState=0&_expand=category`).then(res => {
      const list = res.data;
      setdataSource(list)
    })
  }, [username])

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }}
        rowKey={item => item.id} />
    </div>
  )
}
