import type { APIRoute } from 'astro';
import registry from '../../data/registry.json';

const REPO_OWNER = 'emre-mutlu';
const REPO_NAME = 'git423-odevler';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const studentId = formData.get('studentId')?.toString().trim();
    let week = formData.get('week')?.toString().trim(); // e.g. "hafta-1"
    const files = formData.getAll('files') as File[];

    if (!studentId || !week || files.length === 0) {
      return new Response(JSON.stringify({ error: 'Eksik bilgi veya dosya.' }), { status: 400 });
    }

    const studentInfo = (registry as any)[studentId];
    if (!studentInfo) {
      return new Response(JSON.stringify({ error: `Öğrenci numarası (${studentId}) sistemde bulunamadı.` }), { status: 404 });
    }

    const subeFolderName = studentInfo.sube; // e.g. "Sube-1"
    const studentFolderName = studentInfo.folderName; // e.g. "Irem-Meryem-Toprak"
    const weekFolderName = week.replace('hafta-', 'Hafta-'); // e.g. "Hafta-1"

    const token = import.meta.env.GH_TOKEN || process.env.GH_TOKEN;
    if (!token) throw new Error("Sistem hatası: GitHub yetkilendirme anahtarı bulunamadı.");

    // 2. Get main branch SHA
    const refRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/main`, {
      headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'Astro-Backend' }
    });
    if (!refRes.ok) throw new Error("Ana depo (main) bulunamadı.");
    const refData = await refRes.json();
    const mainSha = refData.object.sha;

    // 3. Create a new branch for the student submission
    const branchName = `submission-${week}-${studentId}-${Date.now()}`;
    const createBranchRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Astro-Backend',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: mainSha })
    });
    if (!createBranchRes.ok) throw new Error("Branch oluşturulamadı.");

    // 4. Upload files to the new branch
    const uploadResults = [];
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const base64Content = Buffer.from(buffer).toString('base64');
      
      // NEW HIERARCHY: Sube-1/Hafta-1/Irem-Meryem-Toprak/index.html
      const filePath = `${subeFolderName}/${weekFolderName}/${studentFolderName}/${file.name}`;
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

      const githubBody = {
        message: `Ödev Yükleme: ${studentFolderName} - ${week} - ${file.name}`,
        content: base64Content,
        branch: branchName
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Astro-Backend',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(githubBody)
      });

      if (!response.ok) throw new Error(`Dosya yüklenemedi: ${file.name}`);
      uploadResults.push(file.name);
    }

    // 5. Create Pull Request
    const prRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Astro-Backend',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `${weekFolderName.toUpperCase()} Ödev Teslimi - ${studentInfo.folderName.replace(/-/g, ' ')}`,
        head: branchName,
        base: 'main',
        body: `Bu PR sistem tarafından **${studentInfo.folderName.replace(/-/g, ' ')} (${studentId})** numaralı öğrencinin ödev teslimi için otomatik açılmıştır.`
      })
    });
    
    if (!prRes.ok) throw new Error("Pull Request oluşturulamadı.");

    return new Response(JSON.stringify({ 
      success: true, 
      message: `${uploadResults.length} dosya başarıyla GitHub'a yüklendi!` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Bilinmeyen bir hata oluştu.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
