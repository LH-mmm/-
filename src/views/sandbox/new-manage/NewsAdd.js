import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'


const { Option } = Select
const { Step } = Steps

export default function NewsAdd(props) {
  const [current, setcurrent] = useState(0)
  const [categoryList, setcategoryList] = useState([])
  const NewsForm = useRef(null)
  const [formInfo, setformInfo] = useState({})
  const [content, setcontent] = useState('')
  const User = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get('/categories').then(res => {
      setcategoryList(res.data)
    })
  }, [])

  // 需要表单校验
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        // console.log(res);
        setformInfo(res)
        setcurrent(current + 1)
      }).catch(err => {
        console.log(err);
      })
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        // console.log(formInfo,content);
        setcurrent(current + 1)
      }

    }

  }
  const handlePrevious = () => {
    setcurrent(current - 1)
  }

  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": User.region?User.region:'全球',
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 0
    }).then(res=>{
      props.history.push(auditState===0?'/news-manage/draft':
      '/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
        placement:'bottomRight',
      });
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            name="新闻标题"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: 'Please input your news title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: 'Please select your news category!' }]}
            >
              <Select>
                {
                  categoryList.map(item =>
                    // 这里的value:id对应了新闻分类下的name：categoryId
                    // 就是说 我之后表单里通过ref拿到的值item 是包含了username和categoryId属性的
                    // username就是我input的值，categoryId就是我Option的value属性值
                    <Option key={item.id} value={item.id}>{item.title}</Option>)
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div className={current === 1 ? '' : style.active}>
        <NewsEditor getContent={(value) => {
          // console.log(value);
          setcontent(value)
        }}></NewsEditor>
      </div>
      <div className={current === 2 ? '' : style.active}>
        
      </div>

      <div style={{ marginTop: '50px' }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={handlePrevious}>上一步</Button>
        }
      </div>
    </div>
  )
}
