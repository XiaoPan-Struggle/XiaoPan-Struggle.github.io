/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
*/
axios.defaults.baseURL = 'https://autumnfish.cn';
      axios.defaults.withCredentials = true;
      axios.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded';
      var app = new Vue({
        el: '#player',
        data: {
          // 查询关键字
          query: '',
          // 歌曲数组
          musicList: [],
          // 歌曲地址
          musicUrl: '',
          //歌曲封面
          picUrl: '',
          // 歌手
          arName: '',
          // 专辑
          alName: '',
          // 歌名
          musicName: '',
          // 简介
          aliaContent: '',
          // 歌曲评论
          hotComments: [],
          // 动画播放状态
          isPlaying: false,
          // 遮罩层的显示状态
          isShow: false,
          // mv地址
          mvUrl: ''
        },
        methods: {
          // 歌曲搜索
          searchMusic() {
            if (this.query == 0) {
              return;
            }
            axios.get('/search?keywords=' + this.query).then((res) => {
              // 保存歌曲
              this.musicList = res.data.result.songs;
              // console.log(this.musicList);
            });
            // 清空搜索区域
            this.query = '';
          },
          // 播放歌曲
          playMusic(id) {
            // 根据id获取歌曲地址
            axios.get('/song/url?id=' + id).then((res) => {
              this.musicUrl = res.data.data[0].url;
              // console.log(res.data.data[0].url);
            });
            // 根据id获取详情
            axios.get('/song/detail?ids=' + id).then((res) => {
              const { al, alia, ar, name } = res.data.songs[0]
              this.picUrl = al.picUrl
              this.arName = ar[0].name
              this.alName = al.name
              this.musicName = name
              this.aliaContent = alia[0]
              // console.log(this.musicCover);
              // console.log(res);
              // musicCover.al.name 专辑
              // musicCover.al.picUrl  封面
              // musicCover.alia  简洁，咧如主题曲
              // musicCover.ar[0].name 歌手
              // musicCover.name 歌名
            });
            // 根据id获取歌曲的热评
            axios.get('/comment/hot?type=0&id=' + id).then((res) => {
              this.hotComments = res.data.hotComments;
              // console.log(res.data.hotComments);
            });
          },
          // audio的play事件
          play() {
            // 开启旋转动画
            this.isPlaying = true;
            // 清空mv的信息
            this.mvUrl = '';
          },
          // audio的pause事件
          pause() {
            this.isPlaying = false;
          },
          // mv播放
          playMV(mvid) {
            if (mvid) {
              this.isShow = true;
              // 获取mv
              axios.get('/mv/url?id=' + mvid).then((res) => {
                // 暂停歌曲的播放
                this.$refs.audio.pause();
                // console.log(this.$refs);
                // 存储mv地址
                this.mvUrl = res.data.data.url;
                // console.log(res);
              });
            }
          },
          // 关闭遮罩层
          hide() {
            this.isShow = false;
            this.$refs.video.pause();
          },
        },
      });