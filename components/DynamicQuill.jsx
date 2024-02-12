import dynamic from 'next/dynamic';

const DynamicQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Chargement de l'éditeur...</p>,
});

export default DynamicQuill;
