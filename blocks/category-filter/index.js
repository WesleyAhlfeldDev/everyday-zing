import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit() {
		const blockProps = useBlockProps( { className: 'cat-filter cat-filter-preview' } );
		return (
			<div { ...blockProps }>
				<span className="cat-filter__pill cat-filter__pill--all is-active">All posts</span>
				<span className="cat-filter__pill cat-filter__pill--food">Food</span>
				<span className="cat-filter__pill cat-filter__pill--finance">Finance</span>
				<span className="cat-filter__pill cat-filter__pill--travel">Travel</span>
			</div>
		);
	},
	save: () => null,
} );
