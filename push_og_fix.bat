@echo off
cd /d d:\Demo\Leasing_v1
git add "client/app/properties/[id]/page.tsx"
git commit -m "fix: use 1080x1080 square image for WhatsApp large card preview"
git push origin master
echo Done. Check Vercel for deployment.
pause
