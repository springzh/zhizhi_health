export default function Doctors() {
  const doctors = [
    {
      name: "张医生",
      title: "主任医师",
      specialty: "口腔修复",
      hospital: "广州口腔医院",
      rating: 4.9,
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "李医生",
      title: "副主任医师",
      specialty: "牙周治疗",
      hospital: "深圳人民医院",
      rating: 4.8,
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "王医生",
      title: "主治医师",
      specialty: "牙齿美容",
      hospital: "广州协和医院",
      rating: 4.7,
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "陈医生",
      title: "主任医师",
      specialty: "儿童牙科",
      hospital: "深圳儿童医院",
      rating: 4.9,
      avatar: "/api/placeholder/100/100"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            专业医生团队
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我们的医生团队拥有丰富的临床经验和专业资质，为您提供最优质的服务
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-sm text-primary mb-2">{doctor.title}</p>
                <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                <p className="text-xs text-gray-600 mb-3">{doctor.hospital}</p>
                <div className="flex items-center justify-center mb-4">
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {doctor.rating}
                  </span>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                  预约咨询
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-secondary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors">
            查看所有医生
          </button>
        </div>
      </div>
    </section>
  )
}