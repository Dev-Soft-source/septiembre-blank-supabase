
import { JoinUsFile, ProcessedFile } from "./types.ts";

export async function processFiles(supabase: any, submissionId: string): Promise<{ files: JoinUsFile[], attachments: ProcessedFile[] }> {
  // Fetch associated files
  console.log("[" + new Date().toISOString() + "] Fetching associated files...");
  const { data: files, error: filesError } = await supabase
    .from('join_us_files')
    .select('*')
    .eq('submission_id', submissionId);

  if (filesError) {
    console.error("[" + new Date().toISOString() + "] Error fetching files:", filesError);
  }

  console.log("[" + new Date().toISOString() + "] Found", files?.length || 0, "files");

  // Prepare attachments
  const attachments: ProcessedFile[] = [];
  
  if (files && files.length > 0) {
    for (const file of files) {
      console.log("[" + new Date().toISOString() + "] Processing file:", file.file_name);
      
      try {
        // Download file from Supabase storage
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('join-us-uploads')
          .download(file.file_path);

        if (downloadError) {
          console.error("[" + new Date().toISOString() + "] Error downloading file:", downloadError);
        } else {
          console.log("[" + new Date().toISOString() + "] Successfully downloaded file:", file.file_name);
          
          // Convert file to base64 for attachment
          const arrayBuffer = await fileData.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
          const base64Content = btoa(binaryString);
          
          attachments.push({
            filename: file.file_name,
            content: base64Content,
            type: file.file_type,
            disposition: "attachment"
          });
        }
      } catch (fileError) {
        console.error("[" + new Date().toISOString() + "] Error processing file:", file.file_name, fileError);
      }
    }
  }

  return { files: files || [], attachments };
}
