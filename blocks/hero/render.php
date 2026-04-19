<?php
/**
 * Hero block — split layout.
 * TODO ACF fields: hero_name, hero_greeting, hero_title, hero_title_em,
 *                  hero_subtitle, hero_cta_primary_label, hero_cta_primary_url,
 *                  hero_cta_ghost_label, hero_cta_ghost_url, hero_photo
 */
$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
?>

<section class="hero-block"<?php echo $anchor; ?>>

	<div class="hero-block__left">
		<div class="hero-block__accent hero-block__accent--pink"></div>
		<div class="hero-block__accent hero-block__accent--purple"></div>
		<div class="hero-block__accent hero-block__accent--lime"></div>
		<div class="hero-block__photo">
			<div class="hero-block__avatar">CJ</div>
		</div>
	</div>

	<div class="hero-block__right">
		<p class="hero-block__greeting">hey hello, I'm</p>
		<h1 class="hero-block__title"><em>Carol Joy</em> — finding the zing in everyday life</h1>
		<p class="hero-block__sub">Real recipes, honest money talk, and adventures you can actually afford. Welcome to my corner of the internet.</p>
		<div class="hero-block__actions">
			<a href="#" class="hero-block__btn hero-block__btn--primary">Start exploring</a>
			<a href="#" class="hero-block__btn hero-block__btn--ghost">Read my story</a>
		</div>
	</div>

</section>
