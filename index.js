(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  // 當前頁面變數
  let pageNow = 1
  // 當前模式變數
  let displayNow = 'card'

  const dataPanel = document.getElementById('data-panel')

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    // displayDataList(data)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))

  // listen to data panel 更多資訊與收藏按鈕監聽
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }

  })


  // listen to search form submit event 
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')

  searchForm.addEventListener('submit', event => {
    event.preventDefault()

    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  // 卡片清單模式
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
<button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  // 簡易清單模式
  function displaySimpleList(data) {
    let simpleContent = `
    <table class="table table-striped">
  <tbody>
    `
    data.forEach(function (item, index) {
      simpleContent += `
    <tr>
      <th scope="row">${item.id}</th>
      <td>${item.title}</td>
      <td><button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
<button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button></td>
    </tr>
     `
    })
    simpleContent += `
      </tbody>
</table>`
    dataPanel.innerHTML = simpleContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.innerText = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    // 更新當前頁面變數
    pageNow = event.target.dataset.page
    console.log(pageNow)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  // 分頁按鈕渲染
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  let paginationData = []

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    // 當前模式判斷
    if (displayNow === 'card') {
      displayDataList(pageData)
    } else {
      displaySimpleList(pageData)
    }

  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  // 瀏覽模式監聽
  const iconsDisplay = document.querySelector('.icons-display')

  iconsDisplay.addEventListener('click', event => {
    if (event.target.matches('#icon-display-simple')) {
      displayNow = 'simple' //更新為當前模式為簡易模式
    } else if (event.target.matches('#icon-display-card')) {
      displayNow = 'card'   //更新為當前模式為卡片模式
    }
    getPageData(pageNow, data)
  })



})()