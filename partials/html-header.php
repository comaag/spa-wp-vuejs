<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale: 1.0, minimum-scale: 1.0, user-scalable=no">
        <title>Atelier Seitz <?php wp_title( '-', true, 'left' ); ?></title>

        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/manifest.json">
        <meta name="msapplication-TileColor" content="#8cb429">
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
        <meta name="theme-color" content="#8cb429">


        <?php global $post; ?>
        <?php if($post->post_type == 'project') : ?>

        <meta name="twitter:card" content="summary" />
        <meta property="og:type" content="article">
        <meta property="og:title" content="<?php the_title() ?>">
        <meta property="og:url" content="<?php the_permalink() ?>">

            <?php
// check if the repeater field has rows of data
            if( have_rows('contents') ):

                // loop through the rows of data
                while ( have_rows('contents') ) : the_row();

                    // display a sub field value
                    if(get_row_layout() == 'gallery') {
                        $gallery = get_sub_field('gallery');
                        foreach($gallery as $image) :
                            ?>
                            <meta property="og:image" content="<?php echo $image['sizes']['large'] ?>">
                            <?php
                        endforeach;
                    }
                    elseif(get_row_layout() == 'text') {
                        $text = get_sub_field('text');
                        ?>
                        <meta property="og:description" content="<?php echo substr(str_replace("\n", ' ', trim(strip_tags($text))), 0, 251) . ' ...'  ?>">
                        <?php
                    }

                endwhile;
            endif;
            ?>
        <?php endif; ?>


        <link rel="stylesheet" type="text/css" href="<?php echo get_theme_file_uri('build/main.css'); ?>" />

        <?php wp_head(); ?>
    </head>
    <body <?php body_class(); ?>>
