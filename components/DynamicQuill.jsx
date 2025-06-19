import dynamic from 'next/dynamic';

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Chargement de l'éditeur...</p>,
});

export default QuillNoSSRWrapper;
