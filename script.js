/*
	Scraping <PRIVATE>
*/

// start at <PRIVATE URL>

var base_url = <PRIVATE>;
var segment_one = <PRIVATE>;
var segment_two = <PRIVATE>;
var index_artists_by_letter = $('.inner-abc a').map((i, el) => base_url + "/" + segment_one + $(el).attr('href')).get();


async function getHtmlFromUrl(url, replaceImg = true) {
	let result;
	
    try {
    	console.log('scraping: ' + url)
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
        console.log('END: ' + url)
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

async function getSongsFromUrl(url) {
	try {
		let replaceImg = true;
		
		let songs = []
		
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
			
		})
		
		/* getLyricsFromUrl*/
		
		return songs;
		
	} catch(error) {
		console.error('catch', error)
	}		
}

async function getAlbumsFromUrl(url) {
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
			img:{
				ur1l: mini_imgs[i]
			}
		}));
		
		for await (let album of albums){
			await getSongsFromUrl(base_url + album.url).then(function(songs){
				album.songs = songs
			})
		}
		
		return albums
	
		
	} catch(error) {
		console.error('catch', error)
	}
}

async function getArtistsFromHtml(html) {
	let artists = $(html).find('.show-artista ul li a').map(
		(i, el) => ({
			name: $(el).attr('title'),
			url: $(el).attr('href')
		})
	).get()
	
	for await (let artist of artists){
		await getBioFromUrl(artist.url).then(function(bio){
			artist.bio = bio
		})
		await getAlbumsFromUrl(artist.url.replace(segment_one, segment_two)).then(function(albums){
			artist.albums = albums
		})
	}
	return artists;
}

async function getArtistsFromUrl(url) {
	let arrayOfArtistOfSomeLetter = [];
	try {
		await getHtmlFromUrl(url).then( async function(html) {
			Array.prototype.push.apply( arrayOfArtistOfSomeLetter, await getArtistsFromHtml(html) );
		})
		return arrayOfArtistOfSomeLetter;
	} catch(error) {
		console.error('catch', error)
	}
}

/* ---------- Execute scraper ---------- */

artists = []

for await (let url of index_artists_by_letter){
    await getArtistsFromUrl(url).then(function(arrayOfArtistOfSomeLetterr){
        Array.prototype.push.apply(artists, arrayOfArtistOfSomeLetterr)
    })
}
