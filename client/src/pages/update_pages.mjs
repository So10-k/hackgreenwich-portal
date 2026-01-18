import fs from 'fs';
import path from 'path';

const pages = ['Profile.tsx', 'Resources.tsx', 'Announcements.tsx'];

pages.forEach(page => {
  const filePath = path.join(process.cwd(), page);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add PortalLayout import if not present
    if (!content.includes('import PortalLayout')) {
      content = content.replace(
        /import { useAuth } from "@\/_core\/hooks\/useAuth";/,
        'import { useAuth } from "@/_core/hooks/useAuth";\nimport PortalLayout from "@/components/PortalLayout";'
      );
    }
    
    // Wrap main return with PortalLayout
    if (!content.includes('<PortalLayout>')) {
      content = content.replace(
        /return \(\s*<div className="min-h-screen/,
        'return (\n    <PortalLayout>\n      <div className="p-8 space-y-6'
      );
      content = content.replace(
        /<\/div>\s*\);\s*}/,
        '</div>\n    </PortalLayout>\n  );\n}'
      );
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${page}`);
  }
});
