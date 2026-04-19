const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: isProduction ? 'production' : 'development',
	devtool: isProduction ? false : 'source-map',

	entry: {
		main:                          path.resolve( __dirname, 'assets/js/main.js' ),
		'blocks/hero/index':           path.resolve( __dirname, 'blocks/hero/index.js' ),
		'blocks/marquee/index':        path.resolve( __dirname, 'blocks/marquee/index.js' ),
		'blocks/category-filter/index': path.resolve( __dirname, 'blocks/category-filter/index.js' ),
		'blocks/blog-feed/index':      path.resolve( __dirname, 'blocks/blog-feed/index.js' ),
		'blocks/bio/index':            path.resolve( __dirname, 'blocks/bio/index.js' ),
		'blocks/instagram-feed/index': path.resolve( __dirname, 'blocks/instagram-feed/index.js' ),
		'blocks/newsletter/index':     path.resolve( __dirname, 'blocks/newsletter/index.js' ),
	},

	output: {
		path: path.resolve( __dirname, 'assets/dist' ),
		filename: '[name].js',
		clean: true,
	},

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: require.resolve( 'babel-loader' ),
					options: {
						presets: [
							require.resolve( '@babel/preset-env' ),
							[ require.resolve( '@babel/preset-react' ), { runtime: 'automatic' } ],
						],
					},
				},
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					require.resolve( 'css-loader' ),
					{
						loader: require.resolve( 'sass-loader' ),
						options: {
							sassOptions: {
								includePaths: [ path.resolve( __dirname, 'node_modules' ) ],
								quietDeps: true,
							},
						},
					},
				],
			},
		],
	},

	plugins: [
		new MiniCssExtractPlugin( { filename: '[name].css' } ),
	],

	externals: {
		'@wordpress/blocks':       [ 'wp', 'blocks' ],
		'@wordpress/block-editor': [ 'wp', 'blockEditor' ],
		'@wordpress/element':      [ 'wp', 'element' ],
		'@wordpress/i18n':         [ 'wp', 'i18n' ],
		react:                     'React',
		'react-dom':               'ReactDOM',
	},

	resolve: {
		extensions: [ '.js', '.jsx' ],
	},
};
