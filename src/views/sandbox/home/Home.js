import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from 'echarts'
import _ from 'lodash'
import myLocalStorage from '../../../util/myLocalStorage'

const { Meta } = Card;
export default function Home() {
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const [allList, setallList] = useState([])
  const [visible, setvisible] = useState(false)
  const [pieChart, setpieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`)
      .then(res => {
        // console.log(res.data);
        setviewList(res.data)
      })
  }, [])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`)
      .then(res => {
        // console.log(res.data);
        setstarList(res.data)
      })
  }, [])

  useEffect(() => {

    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      // console.log(res.data);
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })

    return () => {
      window.onresize = null
    }
  }, [])

  const renderPieView = (obj) => {
    // 新建一个promise对象
    let newPromise = new Promise((resolve) => {
      resolve()
    })
    //然后异步执行echarts的初始化函数
    newPromise.then(() => {
      //	此dom为echarts图标展示dom

      var currentList = allList.filter(item=>item.author === username)
      // console.log(currentList);
      var groupObj = _.groupBy(currentList, item => item.category.title)
      // console.log(groupObj);

      var list = [];
      for(let i in groupObj){
        list.push({
          name:i,
          value:groupObj[i].length
        })
      }
      // console.log(list);

      var myChart;
      if(!pieChart){
        myChart = Echarts.init(pieRef.current);
        setpieChart(myChart)
      }else myChart = pieChart
      var option;

      option = {
        title: {
          text: `${username}用户新闻分类图示`,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '发布数量',
            type: 'pie',
            radius: '50%',
            data: list,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      option && myChart.setOption(option);
    })
    // var myChart = Echarts.init(pieRef.current);

  }

  const renderBarView = (obj) => {
    // console.log(Object.keys(obj));
    var myChart = Echarts.init(barRef.current);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      myChart.resize()
    }
  }

  // const myLocalStorage = new MyLocalStorage()
  const { username, region, role: { roleName } } = myLocalStorage.get('token_lh')  
  // const { username, region, role: { roleName } } = JSON.parse(decodeURIComponent(window.atob(localStorage.getItem("token"))))
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              // bordered
              dataSource={viewList}
              renderItem={item => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              // bordered
              dataSource={starList}
              renderItem={item => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                // src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                src='pig1.jpg'
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                // 放在异步环境下
                setvisible(true)

                // init初始化
                renderPieView()
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ paddingLeft: '30px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer title="个人新闻分类" placement="right" closable={true}
        width='500px'
        onClose={() => { setvisible(false) }} visible={visible}>
        {/* pieRef */}
        <div ref={pieRef} style={{
          width: '100%',
          height: '400px',
          marginTop: '30px'
        }}></div>
      </Drawer>

      <div ref={barRef} style={{
        width: '100%',
        height: '400px',
        marginTop: '30px'
      }}></div>
    </div>
  )
}



// const ajax = ()=>{
//   // 取数据 get
//   // axios.get('http://localhost:8000/posts/2').then(res=>{
//   //   console.log(res.data);
//   // })

//   // 增加数据 post
//   // axios.post('http://localhost:8000/posts',{
//   //   title:'333',
//   //   author:'Helen'
//   // })

//   // 修改数据 替换put
//   // axios.put('http://localhost:8000/posts/1',{
//   //   title:'1111-修改'
//   // })

//   // 修改数据 补丁patch
//   // axios.patch('http://localhost:8000/posts/1',{
//   //   title:'patch-修改'
//   // })

//   // 删除数据 delete
//   // axios.delete('http://localhost:8000/posts/1')

//   // _embed 找关联
//   // axios.get('http://localhost:8000/posts/?_embed=comments').then(res=>{
//   //   console.log(res.data);
//   // })

//   // _expand
//   axios.get('http://localhost:8000/comments/?_expand=post').then(res=>{
//     console.log(res.data);
//   })
// }


// new Promise((resolve, reject) => {
//   this.timer = setTimeout(() => {
//   /**
//    * 此处只做网络请求，不对请求得到的数据进行处理
//    * resolve表示请求成功后的回调，其传的参数将作为then函数中成功函数的实参
//    * reject表示请求失败后的回调，其传的参数将作为then函数中失败函数的实参
//    */
//     if (num > 4) {
//       resolve('第' + num + '次网络请求，输出大于4小于11的数：' + num)
//     } else {
//       reject('第' + num + '次网络请求，输出小于等于4的数：' + num)
//     }
//   }, 10000)
// }).then((data) => {
//   console.log(data)
//   this.num++
//   if (this.num > 10) {
//     console.log('停止并清除定时器！')
//     clearTimeout(this.timer)
//   } else {
//     this.promiseTest(this.num)
//   }
// }, (err) => {
//   console.log(err)
//   this.num++
//   this.promiseTest(this.num)
// })
