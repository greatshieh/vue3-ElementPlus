const Mock = require('mockjs')
import axios from 'axios'

let avatar = []
axios({
  method: 'get',
  url: 'https://randomuser.me/api/?results=100',
  responseType: 'json'
}).then((resp) => {
  avatar = resp.data.results.map((e) => e.picture.medium)
})

export default [
  {
    url: '/transaction/list',
    type: 'get',
    response: (_) => {
      const mockList = []
      for (let i = 0; i < 10; i++) {
        mockList.push(
          Mock.mock({
            href: '',
            username: '@cname()',
            description: '@ctitle(3, 5)',
            content: '@cparagraph(1,3)',
            like: '@integer(10, 50)',
            star: '@integer(20, 100)',
            message: '@integer(1, 10)',
            avatar: avatar[i]
          })
        )
      }

      return {
        code: 20000,
        data: {
          total: 10,
          items: mockList
          //   'items|10': [
          //     {
          //       href: '',
          //       username: '@cname()',
          //       description: '@ctitle(3, 5)',
          //       content: '@cparagraph(1,3)',
          //       avatar() {
          //         const url = Mock.Random.image(
          //           '64x64',
          //           Mock.Random.color(),
          //           '#000',
          //           'png',
          //           this.username[0]
          //         )
          //         return url
          //       }
          //     }
          //   ]
        }
      }
    }
  }
]
