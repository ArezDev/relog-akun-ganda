const puppeteer = require('puppeteer');
const readline = require('readline');
const fs = require('fs');
const axios = require('axios');
const { getImageBase64, getCoverImageBase64, getImageFromFIle } = require('./tools/get_img');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//const MAX_BROWSER = 10; // Maksimal 10 browser paralel

async function relogFB(cokis, index) {

    //Helper untuk waktu
    const waktu = () => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        return `[ ${hh}:${mm} ]`;
    };
    // Atur posisi window ke kanan berdasarkan index
    const windowX = 125 * index;
    // Tambahkan delay berdasarkan index agar tidak membuka browser bersamaan
    await delay(index * 5_000); // Delay 5 detik per index
    const browser = await puppeteer.launch({
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        ignoreDefaultArgs: ['--enable-automation'],
        headless: true,
        defaultViewport: null,
        args: [
            `--window-size=300,450`,
            `--window-position=${windowX},0`
        ]
    });
    const page = await browser.newPage();

    // Extract email and password from cokis string
    const [email, password] = cokis.split('|');
    //const [email, password, emailId, twofactor] = cokis.split('|');
    const dismiss = fs.readFileSync(__dirname + '/tools/dismiss.js', 'utf-8');
    try {
        const domain = '.facebook.com';
        await page.goto('https://facebook.com/?locale=id_ID', { waitUntil: 'networkidle2' });
        const cookies = parseCookie(cokis, domain);
        if (cookies.length > 0) {
            await page.browserContext().setCookie(...cookies);
            await page.reload({ waitUntil: 'networkidle2' });
        }
        await page.waitForSelector('#email', { timeout: 10000 });
        await page.type('#email', email);
        await page.type('#pass', password);
        await page.click('[name="login"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
        await delay(5000); // Tunggu 5 detik untuk memastikan login selesai

        // Cek apakah login berhasil
        const loggedIn = await page.evaluate(() => {
            return document.querySelector('body') && !document.querySelector('input[name="email"]');
        });

        if (!loggedIn) {
            console.error(`[X] Login gagal: ${email}. Periksa kredensial atau cookie.`);
            fs.appendFile('gagal-login.txt', `${cokis}\n`);
            await browser.close();
            return; // Keluar dari fungsi jika login gagal
        }
       
        if (page.url().includes("601051028565049")) {
            console.log(`${waktu()}[${email}] : Akun Dismiss wait...`);
             await page.evaluate(dismiss);
             await delay(15000); // Tunggu 15 detik untuk memastikan dismiss selesai
        } else if (page.url().includes("two_step_verification")) {
            console.log(`${waktu()}[${email}] : Verifikasi 2FA proses...`);
            console.log(`${waktu()}[${twofactor}] : Mengambil kode OTP dari API...`);

            try {
                const response = await axios.get(`https://2fa.fb.rip/api/otp/${twofactor}`);

                if (response?.data?.data?.otp && response?.data?.ok) {
                    const otpCode = response?.data?.data?.otp;
                    console.log(`${waktu()}[${email}] : Verifikasi 2FA dengan kode: ${otpCode}`);

                    await page.evaluate(async (otp) => {
                        const encryptedContext = window.location.href.split('?encrypted_context=')[1].split('&flow=')[0];
                        console.log(encryptedContext);
                        if (otp && encryptedContext) {
                            const payload = new URLSearchParams({
                                fb_api_caller_class: 'RelayModern',
                                fb_api_req_friendly_name: 'useTwoFactorLoginValidateCodeMutation',
                                variables: JSON.stringify({
                                    code: { sensitive_string_value: otp },
                                    method: "TOTP",
                                    flow: "TWO_FACTOR_LOGIN",
                                    encryptedContext: encryptedContext,
                                    maskedContactPoint: null,
                                    next_uri: null
                                }),
                                server_timestamps: 'true',
                                doc_id: '9527647890665779',
                                ...require('getAsyncParams')('POST')
                            });

                            fetch("/api/graphql/", {
                                headers: {
                                    "content-type": "application/x-www-form-urlencoded"
                                },
                                body: payload,
                                method: "POST"
                            }).then(async res=>{
                                if (typeof res.json === 'function') {
                                    return res.json();
                                } else {
                                    const text = await res.text();
                                    try {
                                        return JSON.parse(text);
                                    } catch (e) {
                                        console.error("Gagal parse JSON:", text);
                                        return {};
                                    }
                                }
                            });
                        }
                    }, otpCode);

                    await delay(7000); // Tunggu agar proses lanjut setelah submit OTP
                    await page.goto('https://facebook.com/?sk=welcome', { waitUntil: 'networkidle2', timeout: 15000 });
                    console.log(`${waktu()}[${email}] : Verifikasi 2FA berhasil.`);
                } else {
                    console.warn(`${waktu()}[${email}] : OTP tidak valid atau tidak tersedia dari API.`);
                }
            } catch (err) {
                console.error(`${waktu()}[${email}] : Gagal mengambil OTP:`, err.message);
            }
        }
        await delay(5000);

        await page.goto('https://accountscenter.facebook.com/profiles/', { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
        await delay(5000);

        // Klik akun yang dinonaktifkan
        const statusClone = await page.evaluate(() => {
            const node = document
            .evaluate("//span[normalize-space(.)='Dinonaktifkan']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue;
            if (node) {
                (node.closest('button,[role=button],a,[role=menuitem],[tabindex],div[onclick]') || node).click();
                return 'Sukses: Akun ganda dinonaktifkan ditemukan';
            } else {
                return 'Gagal: Akun ganda dinonaktifkan tidak ditemukan';
            }
        });
        await delay(5000);

        // Klik Aktifkan Ulang
        await page.evaluate(() => {
            const el = Array.from(document.querySelectorAll('span'))
            .find(e => e.textContent.trim() === 'Aktifkan Ulang');
            if (el) {
            const target = el.closest('button,[role=button],a,[tabindex],div[onclick]') || el;
            target.scrollIntoView({ block: 'center' });
            target.click();
            } else {
                console.log('Aktifkan Ulang tidak ditemukan');
            }
        });
        await delay(5000);

        // Isi password
        await page.evaluate(()=>{
            const input = document.querySelector('input[type="password"]');
            if (input) {
            // ambil setter asli dari prototype
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            
            // set value lewat setter asli
            nativeSetter.call(input, 'TEORINGELID');
            
            // kirim event supaya React tahu
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await delay(5000);

        // Klik Lanjutkan
        await page.evaluate(() => {
            const el = Array.from(document.querySelectorAll('span'))
            .find(e => e.textContent.trim() === 'Lanjutkan');
            if (el) {
            const target = el.closest('button,[role=button],a,[tabindex],div[onclick]') || el;
            target.scrollIntoView({ block: 'center' });
            target.click();
            } else {
            console.log('Elemen tidak ditemukan');
            }
        });
        await delay(10000);


        /**
         *  Menyimpan cookie + (opsional) cloneId ke file.
         *  Format baris: email|pass|cloneId| ;c_user=...; xs=...; fr=...;
         */
        const saveCookies = async (page, filename, email, password, cloneId = '') => {
        const targetNames = ['c_user','xs','fr','datr','sb','wd','spin','presence','act','locale'];
        const cookies = await page.browserContext().cookies();
        const sessionCookies = cookies.filter(c => targetNames.includes(c.name));
        if (sessionCookies.length < 3) {
            console.warn(`[!] Cookie kurang lengkap utk ${email}`);
            return;
        }

        const cookieStr = sessionCookies.map(c => `${c.name}=${c.value}`).join('; ');
        // (opsional) deteksi checkpoint …
        try {
            const res  = await axios.get(`https://graph.facebook.com/${email}/picture?type=normal`,
                                        { maxRedirects: 0, validateStatus: null });
            const href = res.headers?.location || '';
            const isCheckpoint = href.includes('C5yt7Cqf3zU');
            console.log(isCheckpoint ? `${waktu()}[${email}] : Checkpoint!`
                                    : `${waktu()}[${email}] : LIVE!`);

            // ⬇️ tulis baris 
            fs.appendFileSync(filename, `${email}|${password}| ;${cookieStr}; |SUKSES_GANDA: ${cloneId || ''}\n`);
            //fs.appendFileSync(filename, `${email}|${password}|${twofactor}| ;${cookieStr}; |SUKSES_GANDA: ${cloneId || ''}\n`);
        } catch (e) {
            console.warn(`${waktu()}[!] Gagal cek akun ${email}:`, e.message);
        }
        };
        const saveToFile = 'akun-sukses-aktif.txt';
        const failedAkun = 'akun-wes-diaktifno.txt';
        
        if (statusClone.includes('Sukses')) {
            console.log(`${waktu()}[${email}] : ${statusClone}`);
            await saveCookies(page, saveToFile, email, password /*, twofactor */);
            console.log(`${waktu()}[${email}] : Cookie disimpan ke ${saveToFile}`);
        } else {
            console.log(`${waktu()}[${email}] : ${statusClone}`);
            fs.appendFileSync(failedAkun, `${cokis}\n`);
            console.log(`${waktu()}[${email}] : Gagal aktifkan ulang, disimpan ke ${failedAkun}`);
        }

    } catch (e) {
        console.error(`${waktu()} [LAUNCH‑ERROR] ${e.message}`);
        fs.appendFileSync('launch-error.txt', `${cokis}\n`);
        return; // lanjutkan loop, jangan hentikan program
    } finally {
      // tutup kalau masih terbuka
        if (browser) {
            try {
            await browser.close(); // kalau sudah tertutup akan melempar → ditangkap
            } catch (_) { /* abaikan */ }
        }
    }
    
};

const parseCookie = (cookieStr, domain) => {
    const cookies = cookieStr
        .split(';')
        .map(cookie => {
            const [name, ...rest] = cookie.trim().split('=');
            const value = rest.join('=');
            return {
                name,
                value,
                domain,
                path: '/',
            };
        });

    // Check if 'presence' is present
    const hasPresence = cookies.some(cookie => cookie.name === 'presence');
    const allowedNames = hasPresence
        ? ['datr', 'sb', 'presence']
        : ['datr', 'sb'];

    return cookies.filter(cookie => allowedNames.includes(cookie.name));
};

(async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const MAX_BROWSER = await new Promise(resolve => {
        rl.question('Masukkan jumlah browser paralel (MAX_BROWSER): ', answer => {
            rl.close();
            resolve(Number(answer) || 1);
        });
    });

    //const lines = fs.readFileSync('akun.txt', 'utf-8').split('\n').filter(Boolean);
    const lines = fs.readFileSync('akun.txt', 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && line.includes('|'));

    let idx = 0;
    while (idx < lines.length) {
        // Ambil batch sebanyak MAX_BROWSER
        const batch = lines.slice(idx, idx + MAX_BROWSER);
        await Promise.all(
            batch.map((line, i) => relogFB(line.trim(), i))
        );
        idx += MAX_BROWSER;
        // Delay antar batch jika ingin (misal 2 detik)
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
})();
