document.addEventListener("DOMContentLoaded", function () {
    // Inputs e sliders RGB
    const rInput = document.getElementById("rInput");
    const gInput = document.getElementById("gInput");
    const bInput = document.getElementById("bInput");

    const rSlider = document.getElementById("rSlider");
    const gSlider = document.getElementById("gSlider");
    const bSlider = document.getElementById("bSlider");

    // Inputs e sliders HSL
    const hInput = document.getElementById("hInput");
    const sInput = document.getElementById("sInput");
    const lInput = document.getElementById("lInput");

    const hSlider = document.getElementById("hSlider");
    const sSlider = document.getElementById("sSlider");
    const lSlider = document.getElementById("lSlider");

    // Inputs e sliders CMYK
    const cInput = document.getElementById("cInput");
    const mInput = document.getElementById("mInput");
    const yInput = document.getElementById("yInput");
    const kInput = document.getElementById("kInput");

    const cSlider = document.getElementById("cSlider");
    const mSlider = document.getElementById("mSlider");
    const ySlider = document.getElementById("ySlider");
    const kSlider = document.getElementById("kSlider");

    // Inputs e sliders HSV
    const hsvHInput = document.getElementById("hsvHInput");
    const hsvSInput = document.getElementById("hsvSInput");
    const hsvVInput = document.getElementById("hsvVInput");

    const hsvHSlider = document.getElementById("hsvHSlider");
    const hsvSSlider = document.getElementById("hsvSSlider");
    const hsvVSlider = document.getElementById("hsvVSlider");

    // Inputs para HEX, Color Picker, e Color Display
    const hexInput = document.getElementById("hexInput");
    const colorPicker = document.getElementById("colorPicker");
    const colorDisplay = document.getElementById("colorDisplay");

    // Funções de Conversão

    // RGB to Hex
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    // Hex to RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    // RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    // HSL to RGB
    function hslToRgb(h, s, l) {
        h = Math.max(0, Math.min(360, h)); // Limita o valor de h entre 0 e 360
        s = Math.max(0, Math.min(100, s)); // Limita o valor de s entre 0 e 100
        l = Math.max(0, Math.min(100, l)); // Limita o valor de l entre 0 e 100

        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 3) return q;
                if (t < 1 / 2) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    // RGB to CMYK
    function rgbToCmyk(r, g, b) {
        const c = 1 - (r / 255);
        const m = 1 - (g / 255);
        const y = 1 - (b / 255);
        const k = Math.min(c, m, y);

        let cmyk = {
            c: 0,
            m: 0,
            y: 0,
            k: Math.round(k * 100)
        };

        if (k < 1) {
            cmyk.c = Math.round(((c - k) / (1 - k)) * 100);
            cmyk.m = Math.round(((m - k) / (1 - k)) * 100);
            cmyk.y = Math.round(((y - k) / (1 - k)) * 100);
        }

        return cmyk;
    }

    // CMYK to RGB
    function cmykToRgb(c, m, y, k) {
        const r = 255 * (1 - c / 100) * (1 - k / 100);
        const g = 255 * (1 - m / 100) * (1 - k / 100);
        const b = 255 * (1 - y / 100) * (1 - k / 100);
        return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
    }

    // RGB to HSV
    function rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;

        const d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
    }

    // HSV to RGB
    function hsvToRgb(h, s, v) {
        h = Math.max(0, Math.min(360, h)); // Limita o valor de h entre 0 e 360
        s = Math.max(0, Math.min(100, s)); // Limita o valor de s entre 0 e 100
        v = Math.max(0, Math.min(100, v)); // Limita o valor de v entre 0 e 100

        let r, g, b;

        h /= 360;
        s /= 100;
        v /= 100;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    // Função para atualizar a cor exibida no color display e picker
    function updateColorDisplay() {
        const r = parseInt(rInput.value);
        const g = parseInt(gInput.value);
        const b = parseInt(bInput.value);
        const hexColor = rgbToHex(r, g, b);
        colorPicker.value = hexColor;  // Atualizando o color picker
        colorDisplay.style.backgroundColor = hexColor;  // Atualizando o color display
        hexInput.value = hexColor;  // Atualizando o campo hex
    }

    // Atualiza todos os campos baseados em RGB
    function updateAllFromRgb() {
        const r = parseInt(rInput.value);
        const g = parseInt(gInput.value);
        const b = parseInt(bInput.value);

        rSlider.value = r; // Sincronizando os sliders com os inputs numéricos
        gSlider.value = g;
        bSlider.value = b;

        const hsl = rgbToHsl(r, g, b);
        hInput.value = hsl.h;
        sInput.value = hsl.s;
        lInput.value = hsl.l;
        hSlider.value = hsl.h;
        sSlider.value = hsl.s;
        lSlider.value = hsl.l;

        const cmyk = rgbToCmyk(r, g, b);
        cInput.value = cmyk.c;
        mInput.value = cmyk.m;
        yInput.value = cmyk.y;
        kInput.value = cmyk.k;
        cSlider.value = cmyk.c;
        mSlider.value = cmyk.m;
        ySlider.value = cmyk.y;
        kSlider.value = cmyk.k;

        const hsv = rgbToHsv(r, g, b);
        hsvHInput.value = hsv.h;
        hsvSInput.value = hsv.s;
        hsvVInput.value = hsv.v;
        hsvHSlider.value = hsv.h;
        hsvSSlider.value = hsv.s;
        hsvVSlider.value = hsv.v;

        updateColorDisplay();
    }

    // Atualiza todos os campos com base no modelo HSL
    function updateAllFromHsl() {
        const h = Math.max(0, Math.min(360, parseInt(hInput.value)));  // Validação para H
        const s = Math.max(0, Math.min(100, parseInt(sInput.value)));  // Validação para S
        const l = Math.max(0, Math.min(100, parseInt(lInput.value)));  // Validação para L

        hSlider.value = h; // Sincronizando os sliders com os inputs numéricos
        sSlider.value = s;
        lSlider.value = l;

        const rgb = hslToRgb(h, s, l);
        rInput.value = rgb.r;
        gInput.value = rgb.g;
        bInput.value = rgb.b;
        rSlider.value = rgb.r;
        gSlider.value = rgb.g;
        bSlider.value = rgb.b;

        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        cInput.value = cmyk.c;
        mInput.value = cmyk.m;
        yInput.value = cmyk.y;
        kInput.value = cmyk.k;
        cSlider.value = cmyk.c;
        mSlider.value = cmyk.m;
        ySlider.value = cmyk.y;
        kSlider.value = cmyk.k;

        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        hsvHInput.value = hsv.h;
        hsvSInput.value = hsv.s;
        hsvVInput.value = hsv.v;
        hsvHSlider.value = hsv.h;
        hsvSSlider.value = hsv.s;
        hsvVSlider.value = hsv.v;

        updateColorDisplay();  // Atualiza o hex e o color picker
    }

    // Atualiza todos os campos com base no modelo CMYK
    function updateAllFromCmyk() {
        const c = Math.max(0, Math.min(100, parseInt(cInput.value)));
        const m = Math.max(0, Math.min(100, parseInt(mInput.value)));
        const y = Math.max(0, Math.min(100, parseInt(yInput.value)));
        const k = Math.max(0, Math.min(100, parseInt(kInput.value)));

        cSlider.value = c; // Sincronizando os sliders com os inputs numéricos
        mSlider.value = m;
        ySlider.value = y;
        kSlider.value = k;

        const rgb = cmykToRgb(c, m, y, k);
        rInput.value = rgb.r;
        gInput.value = rgb.g;
        bInput.value = rgb.b;
        rSlider.value = rgb.r;
        gSlider.value = rgb.g;
        bSlider.value = rgb.b;

        updateColorDisplay();
        updateAllFromRgb();
    }

    // Atualiza todos os campos com base no modelo HSV
    function updateAllFromHsv() {
        const h = Math.max(0, Math.min(360, parseInt(hsvHInput.value)));  // Validação para H
        const s = Math.max(0, Math.min(100, parseInt(hsvSInput.value)));  // Validação para S
        const v = Math.max(0, Math.min(100, parseInt(hsvVInput.value)));  // Validação para V

        hsvHSlider.value = h; // Sincronizando os sliders com os inputs numéricos
        hsvSSlider.value = s;
        hsvVSlider.value = v;

        const rgb = hsvToRgb(h, s, v);
        rInput.value = rgb.r;
        gInput.value = rgb.g;
        bInput.value = rgb.b;
        rSlider.value = rgb.r;
        gSlider.value = rgb.g;
        bSlider.value = rgb.b;

        updateColorDisplay();
        updateAllFromRgb();
    }

    // Sincroniza sliders e inputs para RGB
    rInput.addEventListener("input", updateAllFromRgb);
    gInput.addEventListener("input", updateAllFromRgb);
    bInput.addEventListener("input", updateAllFromRgb);
    rSlider.addEventListener("input", function () {
        rInput.value = rSlider.value;
        updateAllFromRgb();
    });
    gSlider.addEventListener("input", function () {
        gInput.value = gSlider.value;
        updateAllFromRgb();
    });
    bSlider.addEventListener("input", function () {
        bInput.value = bSlider.value;
        updateAllFromRgb();
    });

    // Sincroniza sliders e inputs para HSL
    hInput.addEventListener("input", updateAllFromHsl);
    sInput.addEventListener("input", updateAllFromHsl);
    lInput.addEventListener("input", updateAllFromHsl);
    hSlider.addEventListener("input", function () {
        hInput.value = hSlider.value;
        updateAllFromHsl();
    });
    sSlider.addEventListener("input", function () {
        sInput.value = sSlider.value;
        updateAllFromHsl();
    });
    lSlider.addEventListener("input", function () {
        lInput.value = lSlider.value;
        updateAllFromHsl();
    });

    // Sincroniza sliders e inputs para CMYK
    cInput.addEventListener("input", updateAllFromCmyk);
    mInput.addEventListener("input", updateAllFromCmyk);
    yInput.addEventListener("input", updateAllFromCmyk);
    kInput.addEventListener("input", updateAllFromCmyk);
    cSlider.addEventListener("input", function () {
        cInput.value = cSlider.value;
        updateAllFromCmyk();
    });
    mSlider.addEventListener("input", function () {
        mInput.value = mSlider.value;
        updateAllFromCmyk();
    });
    ySlider.addEventListener("input", function () {
        yInput.value = ySlider.value;
        updateAllFromCmyk();
    });
    kSlider.addEventListener("input", function () {
        kInput.value = kSlider.value;
        updateAllFromCmyk();
    });

    // Sincroniza sliders e inputs para HSV
    hsvHInput.addEventListener("input", updateAllFromHsv);
    hsvSInput.addEventListener("input", updateAllFromHsv);
    hsvVInput.addEventListener("input", updateAllFromHsv);
    hsvHSlider.addEventListener("input", function () {
        hsvHInput.value = hsvHSlider.value;
        updateAllFromHsv();
    });
    hsvSSlider.addEventListener("input", function () {
        hsvSInput.value = hsvSSlider.value;
        updateAllFromHsv();
    });
    hsvVSlider.addEventListener("input", function () {
        hsvVInput.value = hsvVSlider.value;
        updateAllFromHsv();
    });

    // Atualiza todos os campos e sliders quando o color picker é alterado
    colorPicker.addEventListener("input", function () {
        const { r, g, b } = hexToRgb(colorPicker.value);
        rInput.value = r;
        gInput.value = g;
        bInput.value = b;
        rSlider.value = r;
        gSlider.value = g;
        bSlider.value = b;
        updateAllFromRgb();
    });

    


    document.getElementById("generatePdfButton").addEventListener("click", function () {
        // Coletar os valores das cores RGB a partir do color picker
        const hex = document.getElementById("hexInput").value;
        const { r, g, b } = hexToRgb(hex); // Converter hex para RGB
    
        // Coletar outros valores das cores (CMYK, HSL, HSV)
        const c = document.getElementById("cInput").value;
        const m = document.getElementById("mInput").value;
        const y = document.getElementById("yInput").value;
        const k = document.getElementById("kInput").value;
        const h = document.getElementById("hInput").value;
        const s = document.getElementById("sInput").value;
        const l = document.getElementById("lInput").value;
        const hsvH = document.getElementById("hsvHInput").value;
        const hsvS = document.getElementById("hsvSInput").value;
        const hsvV = document.getElementById("hsvVInput").value;
    
        // Criar um novo documento PDF no tamanho A4
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4'); // 'p' para modo retrato, 'mm' para milímetros, 'a4' para o tamanho A4
    
        // Adicionar o título do PDF
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("Relatório da Cor Selecionada", 105, 20, null, null, "center");
    
        // Usar duas colunas para os dados
        const leftColumnX = 20;
        const rightColumnX = 110;
        let currentY = 40;  // Posição vertical inicial
    
        // Adicionar a seção RGB
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");  // Texto em negrito
        doc.setTextColor(60, 60, 60);
        doc.text("RGB:", leftColumnX, currentY);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");  // Texto normal
        doc.setTextColor(0, 0, 0);
        currentY += 10;
        doc.text(`R: ${r}`, leftColumnX, currentY);
        doc.text(`G: ${g}`, leftColumnX, currentY + 10);
        doc.text(`B: ${b}`, leftColumnX, currentY + 20);
    
        // Adicionar a seção CMYK
        currentY += 30;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");  // Texto em negrito
        doc.setTextColor(60, 60, 60);
        doc.text("CMYK:", leftColumnX, currentY);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");  // Texto normal
        doc.setTextColor(0, 0, 0);
        currentY += 10;
        doc.text(`C: ${c}%`, leftColumnX, currentY);
        doc.text(`M: ${m}%`, leftColumnX, currentY + 10);
        doc.text(`Y: ${y}%`, leftColumnX, currentY + 20);
        doc.text(`K: ${k}%`, leftColumnX, currentY + 30);
    
        // Adicionar a seção Hexadecimal logo abaixo de CMYK
        currentY += 40;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");  // Texto em negrito
        doc.setTextColor(60, 60, 60);
        doc.text("Hexadecimal:", leftColumnX, currentY);
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");  // Texto normal
        doc.setTextColor(0, 0, 0);
        currentY += 10;
        doc.text(`${hex}`, leftColumnX, currentY);
    
        // Adicionar a seção HSL na segunda coluna
        currentY = 40;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");  // Texto em negrito
        doc.setTextColor(60, 60, 60);
        doc.text("HSL:", rightColumnX, currentY);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");  // Texto normal
        doc.setTextColor(0, 0, 0);
        currentY += 10;
        doc.text(`H: ${h}°`, rightColumnX, currentY);
        doc.text(`S: ${s}%`, rightColumnX, currentY + 10);
        doc.text(`L: ${l}%`, rightColumnX, currentY + 20);
    
        // Adicionar a seção HSV na segunda coluna
        currentY += 30;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");  // Texto em negrito
        doc.setTextColor(60, 60, 60);
        doc.text("HSV:", rightColumnX, currentY);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");  // Texto normal
        doc.setTextColor(0, 0, 0);
        currentY += 10;
        doc.text(`H: ${hsvH}°`, rightColumnX, currentY);
        doc.text(`S: ${hsvS}%`, rightColumnX, currentY + 10);
        doc.text(`V: ${hsvV}%`, rightColumnX, currentY + 20);
        
        // Adicionar a seção "Cor Selecionada" na segunda coluna, logo abaixo de HSV
        currentY += 38;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");  // Texto em negrito
        doc.setTextColor(60, 60, 60);
        doc.text("Cor Selecionada:", rightColumnX, currentY);
    
        // Desenhar um retângulo arredondado com a cor selecionada na segunda coluna
        doc.setFillColor(r, g, b);
        const rectX = rightColumnX;  // Posição X do retângulo na segunda coluna
        const rectY = currentY + 5;  // Posição Y do retângulo
        const rectWidth = 40;  // Largura do retângulo
        const rectHeight = 10;  // Altura do retângulo (reduzida para ser mais fino)
        const borderRadius = 5;  // Raio da borda arredondada
        doc.roundedRect(rectX, rectY, rectWidth, rectHeight, borderRadius, borderRadius, 'F');  // Desenhar retângulo arredondado
    
        // Salvar o PDF
        doc.save("cor_selecionada.pdf");
    });
    
    // Função para converter hexadecimal para RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }         
        
     
    
});
