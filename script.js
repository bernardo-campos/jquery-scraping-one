/*
	Scraping website
 	+8 hours to complete
	2024-04-02
*/

function printDateTime(dt = null) {
	let opt = {year: '2-digit', month:'2-digit', day:'2-digit'};

	if (dt == null) {
		dt = new Date();
	}

	return dt.toLocaleDateString('es-AR', opt) + ' ' + printTime(dt);
}

function printTime(dt = null) {
	if (dt == null) {
		dt = new Date();
	}
	return dt.toLocaleTimeString('es-AR') + '.' + dt.getMilliseconds();
}

function safeIdFromString(str) {
    // Replace any non-word characters (excluding - and _) with -
    var safeStr = str.replace(/[^\w-]/g, '-');
    // Remove any leading hyphens
    safeStr = safeStr.replace(/^-+/g, '');
    // Remove any trailing hyphens
    safeStr = safeStr.replace(/-+$/g, '');
    // Ensure ID starts with a letter (as per HTML5 spec)
    if (/^\d/.test(safeStr)) {
        safeStr = 'id-' + safeStr;
    }
    return safeStr;
}

function createAccordion(tagId, textContent = '') {
	 // Create collapsible accordion
    var accordion = document.createElement('div');
    accordion.id = 'acc-' + tagId;
    accordion.classList.add('accordion');
    // container.appendChild(accordion);

    // Create accordion item
    var accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');
    accordion.appendChild(accordionItem);

    // Create accordion header
    var accordionHeader = document.createElement('h2');
    accordionHeader.classList.add('accordion-header');
    accordionHeader.setAttribute('id', 'headingOne');
    accordionItem.appendChild(accordionHeader);

    // Create accordion button
    var accordionButton = document.createElement('button');
    accordionButton.classList.add('accordion-button');
    accordionButton.setAttribute('type', 'button');
    accordionButton.setAttribute('data-bs-toggle', 'collapse');
    accordionButton.setAttribute('data-bs-target', '#' + tagId);
    accordionButton.setAttribute('aria-expanded', 'true');
    accordionButton.setAttribute('aria-controls', tagId);
    accordionButton.textContent = textContent;
    accordionHeader.appendChild(accordionButton);

    // Create accordion collapse
    var accordionCollapse = document.createElement('div');
    accordionCollapse.classList.add('accordion-collapse', 'collapse', 'show');
    accordionCollapse.setAttribute('id', tagId);
    accordionCollapse.setAttribute('aria-labelledby', 'headingOne');
    accordionCollapse.setAttribute('data-bs-parent', '.accordion');
    accordionItem.appendChild(accordionCollapse);

    // Create accordion body
    var accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');
    accordionCollapse.appendChild(accordionBody);

    // Create table
    var table = document.createElement('table');
    table.classList.add('table', 'table-sm');
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);

    accordionBody.appendChild(table);

    return accordion;
}

function createTag(object) {
	var element = document.createElement(object.tag);

    // Set attributes if provided
    if (object.attributes) {
        for (var attr in object.attributes) {
            element.setAttribute(attr, object.attributes[attr]);
        }
    }

    if (object.text) {
        element.textContent = object.text;
    }

    return element;
}

function createRow(columns) {
    var row = document.createElement('tr');

    for (var i = 0; i < columns.length; i++) {
        var cell = document.createElement('td');

        if (typeof columns[i] === 'object') {
    		cell.appendChild( createTag(columns[i]) );
        } else {
            cell.textContent = columns[i];
        }

        row.appendChild(cell);
    }

    return row;
}

async function loadJQuery() {
    return new Promise((resolve, reject) => {

        var script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.6.3.min.js';
        document.getElementsByTagName('head')[0].appendChild(script);

        // Listen for the script's onload event
        script.onload = resolve;
        // Listen for any errors while loading the script
        script.onerror = reject;
    });
}

function setLastRequest() {
	let span = document.getElementById('last_request_at');
	if (span) {
		span.textContent = printDateTime();
	}
}

function createRowDivWithColumns() {
    // Create a new row element
    var row = document.createElement('div');
    row.classList.add('row');

    [
        { label: 'Started at:', id: 'started_at', value: printDateTime() },
        { label: 'Last request at:', id: 'last_request_at', value: '' },
    ]
    .forEach(function(column) {
        var col = document.createElement('div');
        col.classList.add('col');

        var span = document.createElement('span');
        span.id = column.id;
        span.classList.add('ms-2');
        span.textContent = column.value;

        // Create a text node for the label
        var labelNode = document.createTextNode(column.label);

        col.appendChild(labelNode);
        col.appendChild(span);

        row.appendChild(col);
    });

    return row;
}

async function init(getContainer = true) {

	document.body.innerHTML = '';

	try {
		await loadJQuery();
		console.log('jQuery has been loaded successfully!');
    } catch (error) {
        console.error('Error loading jQuery:', error);
    }

	var script = document.createElement('script');
	script.src = 'https://code.jquery.com/jquery-3.6.3.min.js';
	document.getElementsByTagName('head')[0].appendChild(script);

	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css';
	document.getElementsByTagName('HEAD')[0].appendChild(link);

	let bootstrapScript = document.createElement('script');
    bootstrapScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
    document.head.appendChild(bootstrapScript);

    var container = document.createElement('div');
    container.id = 'container';
    container.classList.add('container');
    document.body.appendChild(container);

    let rowDiv = createRowDivWithColumns();
	container.appendChild(rowDiv);

    if (getContainer) {
    	return container;
    }
}

/*------------------------*/
(function(console){

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)
/*------------------------*/


async function getHtmlFromUrl(url, replaceImg = true) {
	let result;
	
    try {

    	console.log('scraping: ' + url);
    	setLastRequest();

        result = await jQuery.ajax({
            method:'GET',
            url: url,
            error: function(x,y,z){ console.log(x,y,z); },
            success: function(html) {
                html = html.replace(/<script[\s|\S]*?<\/script>/g,'')
					.replace(/<meta[\s|\S]*?>/g,'')
					.replace(/<link[\s|\S]*?>/g,'');
				return replaceImg 
					? html.replace(/<img[\s|\S]*?>/g,'')
					: html;
            }
        });
        // console.log('END: ' + url)
        return result
    } catch (error) {
        console.error('catch', error)
    }
}

async function getBioFromUrl(url) {
	let bio = '';
	try {
		await getHtmlFromUrl(url).then( function(html) {
			bio = $(html).find('.notinoti').html()
		})
		return bio;
	} catch(error) {
		console.error('catch', error)
	}	
}

async function getSongsAndImgFromUrl(url) {
	try {
		let replaceImg = true;
		
		let songs = [];
		let img = '';
		
		await getHtmlFromUrl(url, !replaceImg).then( function(html) {
			
			$(html).find('ul.temas > li').each( function(index) {
				song = {};
				song.number = $(this).find('span.numero').text().replace('.','');
				song.title = $(this).find('span.nombre').text();
				if (!$(this).hasClass('sinletra')){
					song.url =$(this).find('a').attr('href');
				}
				songs.push(song);
			});

			img = $(html).find('article figure > img').attr('src');
			
		})
		
		/* getLyricsFromUrl*/
		
		return {songs, img};
		
	} catch(error) {
		console.error('catch', error)
	}		
}

async function getLyricFromUrl(url) {
	let lyricHtml = '';
	try {
		await getHtmlFromUrl(url).then( function(html1) {
			lyricHtml = $(html1).find('article header + p:first').html()
		})
		return lyricHtml;
	} catch(error) {
		console.error('catch', error)
	}	
}

async function getAlbumsFromUrl(url, table = null) {
	let titles, years, urls, mini_imgs;
	try {
		let replaceImg = true;
		await getHtmlFromUrl(url, !replaceImg).then( function(html) {
			titles = $(html).find('section.otros a').map((i, el) => $(el).attr('title')).get();
			years = $.map($(html).find("section.otros a h6"), $.text)
			urls = $(html).find('section.otros a').map((i, el) => $(el).attr('href')).get();
			mini_imgs = $(html).find('section.otros a img').map((i, el) => $(el).attr('src')).get();
		})
		
		if (titles.length != years.length || urls.length != mini_imgs.length || years.length != urls.length){
			console.error('longitudes inconsistentes: ', url);
		}
		
		albums = titles.map((value, i) => ({
			title: titles[i],
			year: years[i],
			url: urls[i],
			img_mini_url: mini_imgs[i]
		}));
		
		for await (let album of albums) {

			let start = new Date();

			await getSongsAndImgFromUrl(base_url + album.url).then(function(obj){
				album.img_url = obj.img;
				album.songs = obj.songs;
			})
			
			/* forEach song of album, get the lyrics */
			for await (let song of album.songs) {
				if(song.url) {
					await getLyricFromUrl(base_url + song.url).then(function(lyricHtml){
						song.lyric = lyricHtml;
					})
				}
			}

			var millisecondsDiff = (new Date()).getTime() - start.getTime();

			if (table != null) {
				let row = createRow([
					{
						tag: 'a',
						attributes: {
							href: album.url,
							target: '_blank'
						},
						text: album.title
					},
					album.songs.length,
					millisecondsDiff,
				]);
				table.querySelector('tbody').appendChild(row)
			}
		}
		
		return albums;
	
		
	} catch(error) {
		console.error('catch', error)
	}
}

async function getArtistsFromHtml(html, container = null) {
	let artists = $(html).find('.show-artista ul li a').map(
		(i, el) => ({
			name: $(el).attr('title'),
			url: $(el).attr('href')
		})
	).get()
	
	for await (let [i, artist] of artists.entries()){
		// if (i > 3) { break; } // debug line
		let table = null;
		if (container != null) {
			let id = safeIdFromString(artist.name);
			let accordion = createAccordion( id, artist.name );
			container.appendChild(accordion)
			table = accordion.querySelector('table');
		}

		await getBioFromUrl(artist.url).then(function(bio){
			artist.bio = bio
		})

		let album_url = artist.url.replace('biografia/', 'discos_letras/');

		await getAlbumsFromUrl(album_url, table).then(function(albums) {
			artist.albums = albums
		})
		
		console.save(artist, artist.name + '.json')
		
		delete(artists[i]);
	}
	
	return artists;
}

async function getArtistsFromUrl(url, container = null) {
	let arrayOfArtistOfSomeLetter = [];
	try {
		await getHtmlFromUrl(url).then( async function(html) {
			Array.prototype.push.apply( arrayOfArtistOfSomeLetter, await getArtistsFromHtml(html, container) );
		})
		return arrayOfArtistOfSomeLetter;
	} catch(error) {
		console.error('catch', error)
	}
}

/****** Secret URL ******/
var base_url = "";

(async function () {
	var container = await init();

	// start at websiteurl/flotanteArtistas.php?letra=%23

	// create array of letters ['%23', 'a', 'b', ..., 'z']
	var alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))
	alphabet.unshift('%23');

	// create array of urls that contains the list of artists for each letter
	var index_artists_by_letter = alphabet.map(char => `${base_url}/biografia/index.php?letra=${char}`);

	artists = [];

	for await (let [i, url] of index_artists_by_letter.entries()) {
		// if (i > 2) { break; } // debug line
	    await getArtistsFromUrl(url, container).then(function(arrayOfArtistOfSomeLetterr){
	        Array.prototype.push.apply(artists, arrayOfArtistOfSomeLetterr);
	    });
	}

})()

