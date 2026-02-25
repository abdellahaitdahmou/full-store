import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const categories = [
    'إلكترونيات',
    'ملابس رجالية',
    'ملابس نسائية',
    'عطور',
    'ساعات العصر',
    'ديكور المنزل'
]

const sampleProducts = [
    {
        title: 'ساعة يد ذكية فاخرة',
        description: 'ساعة ذكية تتميز بتصميم كلاسيكي مع شاشة AMOLED ودعم تتبع الصحة واللياقة البدنية. مقاومة للماء وتأتي مع حزام من الجلد الطبيعي.',
        price: 1299.00,
        category: categories[4],
        images: [
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800'
        ]
    },
    {
        title: 'سماعات رأس لاسلكية محيطية',
        description: 'استمتع بتجربة صوتية لا مثيل لها مع تقنية إلغاء الضوضاء النشط. بطارية تدوم حتى 30 ساعة واستجابة صوتية فائقة الوضوح.',
        price: 899.50,
        category: categories[0],
        images: [
            'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1546435770-a3e426fac365?auto=format&fit=crop&q=80&w=800'
        ]
    },
    {
        title: 'عطر عود وورد للرجال',
        description: 'مزيج فاخر من العود الأصيل والورد الدمشقي، يعطي رائحة تدوم طويلاً وتترك انطباعاً قوياً في أي مناسبة.',
        price: 450.00,
        category: categories[3],
        images: [
            'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800'
        ]
    },
    {
        title: 'جاكيت جلد طبيعي كلاسيكي',
        description: 'جاكيت جلدي مبطن بأجود أنواع الجلد الطبيعي ليوفر الدفء والأناقة معاً. مثالي لفصل الشتاء والمناسبات الليلية.',
        price: 2100.00,
        category: categories[1],
        images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=800'
        ]
    },
    {
        title: 'مجموعة ديكور نباتات اصطناعية',
        description: 'أضف لمسة من الحياة البرية إلى منزلك دون القلق بشأن الصيانة المستمرة. مجموعة من نباتات السيراميك الفاخرة المتقنة.',
        price: 280.00,
        category: categories[5],
        images: [
            'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1510251197878-a2e6d2cb590c?auto=format&fit=crop&q=80&w=800'
        ]
    },
    {
        title: 'حقيبة يد جلدية فاخرة للسيدات',
        description: 'حقيبة راقية مصممة يدوياً لتناسب الإطلالات الكلاسيكية والعملية. تحتوي على مقصورات متعددة ومسكة يد مريحة.',
        price: 950.00,
        category: categories[2],
        images: [
            'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
        ]
    },
    {
        title: 'عدسة كاميرا احترافية 50mm',
        description: 'احصل على صور بورتريه نقية مع تفاصيل بالغة الدقة بفضل هذه العدسة ذات الفتحة العريضة (f/1.8).',
        price: 3200.00,
        category: categories[0],
        images: [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1502982720700-baf97b42aa15?auto=format&fit=crop&q=80&w=800'
        ]
    },
    {
        title: 'نظارات شمسية رجالية عصرية',
        description: 'احمي عينيك من الأشعة فوق البنفسجية بأناقة. إطارات خفيفة الوزن وعدسات مستقطبة تمنع التوهج وتوضح الرؤية.',
        price: 550.00,
        category: categories[1],
        images: [
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1572635196237-14b3f281501f?auto=format&fit=crop&q=80&w=800'
        ]
    }
]

async function seedProducts() {
    console.log('🌱 البدأ في إضافة المنتجات التجريبية...')

    const { data, error } = await supabase
        .from('products')
        .insert(sampleProducts)

    if (error) {
        console.error('❌ حدث خطأ أثناء إضافة المنتجات:', error.message)
        process.exit(1)
    }

    console.log(`✅ تم إضافة ${sampleProducts.length} منتجات بنجاح بقاعدة البيانات!`)
}

seedProducts()
