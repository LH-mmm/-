import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, notification, Tag } from 'antd';
import myLocalStorage from '../../../util/myLocalStorage'

export default function AuditList(props) {
  const [dataSource, setdataSource] = useState([])

  // const myLocalStorage = new MyLocalStorage()
  const { username } = myLocalStorage.get('token_lh')
  // const { username } = JSON.parse(decodeURIComponent(window.atob(localStorage.getItem("token"))))
  useEffect(() => {
    // console.log(username);
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
      .then(res => {
        // console.log(res.data);
        setdataSource(res.data)
      })
  }, [username])

  const auditList = ['未审核', '审核中', '已通过', '未通过']
  // const publishList = ['未发布', '待发布', '已上线', '已下线']

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            {
              item.auditState === 1 && <Button onClick={() => handleRervert(item)}>撤销</Button>
            }
            {
              item.auditState === 2 && <Button danger onClick={() => handlePublish(item)}>发布</Button>
            }
            {
              item.auditState === 3 && <Button type='primary' onClick={() => handleUpdate(item)}>更新</Button>
            }

          </div>
        )
      }
    },
  ];

  const handleRervert = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    // 后端
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到草稿箱中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }

  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }

  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      'publishState': 2,
      'publishTime': Date.now()
    }).then(res => {
      props.history.push(`/publish-manage/published`)
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已发布】中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }}
        rowKey={item => item.id} />
    </div>
  )
}
