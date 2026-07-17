/*
	Phantom by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile)
			$body.addClass('is-touch');

	// Forms.
		var $form = $('form');

		// Auto-resizing textareas.
			$form.find('textarea').each(function() {

				var $this = $(this),
					$wrapper = $('<div class="textarea-wrapper"></div>'),
					$submits = $this.find('input[type="submit"]');

				$this
					.wrap($wrapper)
					.attr('rows', 1)
					.css('overflow', 'hidden')
					.css('resize', 'none')
					.on('keydown', function(event) {

						if (event.keyCode == 13
						&&	event.ctrlKey) {

							event.preventDefault();
							event.stopPropagation();

							$(this).blur();

						}

					})
					.on('blur focus', function() {
						$this.val($.trim($this.val()));
					})
					.on('input blur focus --init', function() {

						$wrapper
							.css('height', $this.height());

						$this
							.css('height', 'auto')
							.css('height', $this.prop('scrollHeight') + 'px');

					})
					.on('keyup', function(event) {

						if (event.keyCode == 9)
							$this
								.select();

					})
					.triggerHandler('--init');

				// Fix.
					if (browser.name == 'ie'
					||	browser.mobile)
						$this
							.css('max-height', '10em')
							.css('overflow-y', 'auto');

			});

	// Menu.
		var $menu = $('#menu');

		$menu.wrapInner('<div class="inner"></div>');

		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					if (href == '#menu')
						return;

					window.setTimeout(function() {
						window.location.href = href;
					}, 350);

			})
			.append('<a class="close" href="#menu">Close</a>');

	$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});

	// Portfolio content rendering.
		var defaultGallery = [
			'images/pic05.jpg',
			'images/pic06.jpg',
			'images/pic07.jpg',
			'images/pic08.jpg'
		];
		var projectGrid = document.getElementById('project-grid');
		if (projectGrid && window.portfolioCards) {
			var projectCount = document.getElementById('project-count');
			if (projectCount) {
				projectCount.textContent = window.portfolioCards.length;
			}

			projectGrid.innerHTML = window.portfolioCards.map(function(card) {
				var href = 'project.html?project=' + encodeURIComponent(card.id);
				var tech = (card.tech || []).map(function(item) {
					return '<span class="card-chip">' + item + '</span>';
				}).join('');
				return [
					'<article class="' + card.style + '">',
						'<a href="' + href + '" class="card-link">',
							'<span class="image"><img src="' + card.image + '" alt="" /></span>',
						'</a>',
						'<div class="card-details">',
							'<h2>' + card.title + '</h2>',
							'<div class="card-meta">' + tech + '</div>',
						'</div>',
					'</article>'
				].join('');
			}).join('');

			Array.prototype.forEach.call(projectGrid.querySelectorAll('article'), function(article, index) {
				article.style.animationDelay = (index * 90) + 'ms';
			});
		}

		var projectRoot = document.querySelector('.project-page');
		if (projectRoot && window.portfolioProjects) {
			var params = new URLSearchParams(window.location.search);
			var projectKey = params.get('project') || 'csesim';
			var project = window.portfolioProjects[projectKey] || window.portfolioProjects.csesim;

			document.title = project.title + ' | Jessica Li';
			document.body.style.background = 'linear-gradient(180deg, #1b2230 0%, #111720 100%)';
			document.body.style.color = '#f7f7fb';

			document.getElementById('project-tag').textContent = project.tag;
			document.getElementById('project-title').textContent = project.title;
			var videoPanel = document.querySelector('.project-video-panel');
			var videoFrame = document.getElementById('project-video');
			if (project.video) {
				videoFrame.src = project.video;
				videoPanel.style.display = '';
			} else {
				videoFrame.removeAttribute('src');
				videoPanel.style.display = 'none';
			}
			var playableWrap = document.getElementById('project-playable-wrap');
			var playableLink = document.getElementById('project-playable');
			var playableLabel = project.playableLabel || 'Playable Link';
			if (project.playable) {
				playableLink.href = project.playable;
				playableLink.textContent = project.playable;
				playableWrap.querySelector('.section-label-inline').textContent = playableLabel;
				playableWrap.style.display = 'flex';
			} else {
				playableWrap.style.display = 'none';
			}

			var meta = document.getElementById('project-meta');
			meta.innerHTML = project.meta.map(function(item) {
				return '<span class="pill">' + item + '</span>';
			}).join('');

			var body = document.getElementById('project-body');
			body.innerHTML = project.description.map(function(paragraph) {
				return '<p>' + paragraph + '</p>';
			}).join('');

			var galleryViewport = document.getElementById('project-gallery');
			var galleryTrack = document.getElementById('project-gallery-track');
			if (galleryViewport && galleryTrack) {
				galleryViewport.className = 'project-gallery project-gallery-' + projectKey;
				var galleryImages = (project.gallery && project.gallery.length >= 3 ? project.gallery : defaultGallery).slice();
				var galleryMarkup = galleryImages.map(function(image, index) {
					return [
						'<div class="project-gallery-item">',
							'<img src="' + image + '" alt="" loading="lazy" />',
						'</div>'
					].join('');
				}).join('');

				galleryTrack.innerHTML = galleryMarkup;

				var dragging = false;
				var dragStartX = 0;
				var dragStartScroll = 0;

				galleryViewport.addEventListener('pointerdown', function(event) {
					dragging = true;
					dragStartX = event.clientX;
					dragStartScroll = galleryViewport.scrollLeft;
					if (galleryViewport.setPointerCapture) {
						galleryViewport.setPointerCapture(event.pointerId);
					}
					galleryViewport.classList.add('is-dragging');
				});

				galleryViewport.addEventListener('pointermove', function(event) {
					if (!dragging) {
						return;
					}

					galleryViewport.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
				});

				function endDrag() {
					dragging = false;
					galleryViewport.classList.remove('is-dragging');
				}

				galleryViewport.addEventListener('pointerup', endDrag);
				galleryViewport.addEventListener('pointercancel', endDrag);
				galleryViewport.addEventListener('lostpointercapture', endDrag);
			}
		}

})(jQuery);
