/*
	Scraping <PRIVATE>
*/

// start at <PRIVATE URL>

var base_url = <PRIVATE>;
var first_segment = <PRIVATE>;

var index_artists_by_letter = $('.inner-abc a').map((i, el) => base_url + first_segment + $(el).attr('href')).get();

async function getHtmlFromUrl(url) {
	let result;
	
    try {
    	console.log('scraping: ' + url)
        result = await jQuery.ajax({
            method:'GET',
            url: url,
            error: function(x,y,z){ console.log(x,y,z); },
            success: function(html) {
                return html.replace(/<script[\s|\S]*?<\/script>/g,'')
					.replace(/<img[\s|\S]*?>/g,'')
					.replace(/<meta[\s|\S]*?>/g,'')
					.replace(/<link[\s|\S]*?>/g,'');
            }
        });
        console.log('END: ' + url)
        return result
    } catch (error) {
        console.log(error)
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
		console.log(error)
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
		console.log(error)
	}
}

artists = []

for await (let url of index_artists_by_letter){
    await getArtistsFromUrl(url).then(function(arrayOfArtistOfSomeLetterr){
        Array.prototype.push.apply(artists, arrayOfArtistOfSomeLetterr)
    })
}
