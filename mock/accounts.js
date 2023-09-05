const accounts = {
  wechat: {
    offiaccount: ['学大学', '陕西升学'],
    miniprogram: ['志愿老司机', '029初升高']
  }
}

export default [
  {
    url: '/accounts/list',
    type: 'get',
    response: (config) => {
      const { kind } = config.query

      const result = []
      for (key in accounts[kind]) {
        result.push({
          value: key,
          label: key === 'offiaccount' ? '公众号' : '小程序',
          options: accounts[kind][key].map((e) => ({ value: e }))
        })
      }

      return {
        code: 20000,
        data: result
      }
    }
  }
]
