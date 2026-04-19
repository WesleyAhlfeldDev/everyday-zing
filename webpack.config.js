const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: isProduction ? 'production' : 'development',
	devtool: isProduction ? false : 'source-map',

	entry: {
		main: path.resolve( __dirname, 'assets/js/main.js' ),
		'blocks/hero/index': path.resolve( __dirname, 'blocks/hero/index.js' ),
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

	// WordPress provides these globally — don't bundle them
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
