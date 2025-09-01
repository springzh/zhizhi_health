export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">知治健康</h3>
            <p className="text-gray-400 text-sm">
              专注于提供优质的口腔健康服务和全面的医疗解决方案
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">核心服务</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/services/dental" className="hover:text-white transition-colors">口腔服务</a></li>
              <li><a href="/membership" className="hover:text-white transition-colors">医疗会员卡</a></li>
              <li><a href="/rights-cards" className="hover:text-white transition-colors">健康权益卡</a></li>
              <li><a href="/services/cell" className="hover:text-white transition-colors">细胞服务</a></li>
              <li><a href="/doctors" className="hover:text-white transition-colors">医生预约</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">常见问题</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">联系我们</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>电话: 400-123-4567</li>
              <li>邮箱: info@zhizhihealth.com</li>
              <li>地址: 广州市天河区珠江新城</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">关注我们</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                微信
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                微博
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                抖音
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 知治（广州）健康科技有限公司. 版权所有.
          </p>
        </div>
      </div>
    </footer>
  )
}