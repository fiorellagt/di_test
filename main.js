function request(url) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 2000;
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.status);
                }
            }
        }
        xhr.ontimeout = function () {
            reject('timeout');
        }
        xhr.open('get', url, true);
        xhr.send();
    })
}

function addArticle(article, index) {

    let title = document.createElement('h3');
    title.innerHTML = article.title;
    title.id = 'title_text' + index;
    let titleContainer = document.createElement('div');
    titleContainer.id = 'titleContainer' + index;
    titleContainer.classList.add('title');
    titleContainer.appendChild(title);
    let author = document.createElement('div');
    author.id = 'author' + index;
    author.classList.add('info_content');
    if (article.creator != null) {
        author.innerHTML = 'Av ' + article.creator;
    }
    let pubDate = document.createElement('div');
    pubDate.id = 'pubDate' + index;
    pubDate.classList.add('info_content');
    pubDate.innerHTML = 'Publicerad ' + article.pubDate;
    let info = document.createElement('div');
    info.id = 'info' + index;
    info.classList.add('info');
    info.append(pubDate, author);
    let link = document.createElement('a');
    link.href = article.link;
    link.innerHTML = article.link;

    let img = document.createElement('img');
    if (article.url != null) {
        img.id = 'image' + index;
        img.src = (article.url[0])['$'].url;
    }

    // create an element that will contain elements created before
    let mainDiv = document.createElement('div');
    mainDiv.id = 'article' + index;
    mainDiv.classList.add('article_preview');
    // append all elements to the article's main Div
    mainDiv.appendChild(titleContainer);
    mainDiv.appendChild(img);
    mainDiv.appendChild(info);
    mainDiv.appendChild(link);
    document.getElementById('content').appendChild(mainDiv);
}

window.onload = function () {
    const url = 'http://localhost:8080/feed';
    const myPromise = request(url);

    myPromise.then(function handleUsersList(value) {

        const list = JSON.parse(value);
        console.log('Resolved', value[0].title);
        for (let i = 0; i < list.length; i++) {
            addArticle(list[i], i);
        }
        return value;
    }).then(function handleErrors(error) {
        console.log('Rejected', error);
    });
}
