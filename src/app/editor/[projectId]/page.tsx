import { protectServer } from '@/features/auth/utils';
import { Editor } from '@/features/editor/components/editor';
const EditorProjectIdPage = async() => {
  await protectServer();
  // only signedin users can access the editor
  return (
     
      <Editor/>
   
  )
};

export default EditorProjectIdPage;
