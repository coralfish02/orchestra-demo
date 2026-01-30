"use client";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // マークダウンをHTMLに変換
  let html = content;
  
  // 見出し2 (##)
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">$1</h2>');
  
  // 見出し3 (###)
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-semibold text-gray-700 mt-6 mb-3">$1</h3>');
  
  // 太字 (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // リスト項目を処理（行ごとに）
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('- ')) {
      // リスト項目の開始
      if (!inList) {
        processedLines.push('<ul class="list-disc ml-6 mb-4 space-y-2">');
        inList = true;
      }
      processedLines.push(`<li class="mb-1">${line.substring(2)}</li>`);
    } else {
      // リストの終了
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      // 見出しや空行でない場合は段落として処理
      if (line && !line.startsWith('<h')) {
        processedLines.push(`<p class="mb-4 leading-relaxed">${line}</p>`);
      } else if (line.startsWith('<h')) {
        processedLines.push(line);
      }
    }
  }
  
  // リストが最後まで続いていた場合
  if (inList) {
    processedLines.push('</ul>');
  }
  
  html = processedLines.join('\n');

  return (
    <div 
      className="text-gray-700"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
